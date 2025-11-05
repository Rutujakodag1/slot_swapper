from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, UserSerializer
from django.contrib.auth import get_user_model
from .serializers import LoginSerializer
from rest_framework import permissions
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


# class LoginView(generics.GenericAPIView):
#     permission_classes = [AllowAny]
#     serializer_class = UserSerializer

#     def post(self, request):
#         username = request.data.get('username')
#         password = request.data.get('password')
#         user = authenticate(username=username, password=password)

#         if user:
#             refresh = RefreshToken.for_user(user)
#             return Response({
#                 'refresh': str(refresh),
#                 'access': str(refresh.access_token),
#                 'user': UserSerializer(user).data
#             })
#         return Response({'error': 'Invalid credentials'}, status=400)


User = get_user_model()

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        login_value = serializer.validated_data['login']
        password = serializer.validated_data['password']

        # check if login_value is email or username
        try:
            if "@" in login_value:
                user_obj = User.objects.get(email=login_value)
            else:
                user_obj = User.objects.get(username=login_value)
        except User.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=400)

        user = authenticate(username=user_obj.username, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                }
            })

        return Response({'error': 'Invalid credentials'}, status=400)
    

from rest_framework.views import APIView
from rest_framework import status, permissions
from .models import Event, SwapRequest
from .serializers import EventSerializer, SwapRequestSerializer

class EventListCreateView(generics.ListCreateAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Event.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class EventRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Event.objects.filter(owner=self.request.user)
    

# GET /api/swappable-slots/
class SwappableSlotsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        slots = Event.objects.filter(status="SWAPPABLE").exclude(owner=request.user)
        serializer = EventSerializer(slots, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# POST /api/swap-request/
class SwapRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        my_slot_id = request.data.get("mySlotId")
        their_slot_id = request.data.get("theirSlotId")

        try:
            my_slot = Event.objects.get(id=my_slot_id, owner=request.user, status="SWAPPABLE")
            their_slot = Event.objects.get(id=their_slot_id, status="SWAPPABLE")
        except Event.DoesNotExist:
            return Response({"error": "Invalid or unavailable slots"}, status=400)

        swap_request = SwapRequest.objects.create(
            from_user=request.user,
            to_user=their_slot.owner,
            my_slot=my_slot,
            their_slot=their_slot,
            status="PENDING",
        )

        # mark both slots as pending
        my_slot.status = "SWAP_PENDING"
        their_slot.status = "SWAP_PENDING"
        my_slot.save()
        their_slot.save()

        return Response(SwapRequestSerializer(swap_request).data, status=201)


# POST /api/swap-response/<request_id>/
class SwapResponseView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, request_id):
        accept = request.data.get("accept")  # true / false

        try:
            swap_request = SwapRequest.objects.get(id=request_id, to_user=request.user)
        except SwapRequest.DoesNotExist:
            return Response({"error": "Swap request not found"}, status=404)

        if swap_request.status != "PENDING":
            return Response({"error": "Swap already handled"}, status=400)

        my_slot = swap_request.my_slot
        their_slot = swap_request.their_slot

        if accept:
            # exchange ownerships
            my_owner = my_slot.owner
            their_owner = their_slot.owner

            my_slot.owner = their_owner
            their_slot.owner = my_owner

            my_slot.status = "BUSY"
            their_slot.status = "BUSY"

            swap_request.status = "ACCEPTED"

            my_slot.save()
            their_slot.save()
            swap_request.save()
        else:
            swap_request.status = "REJECTED"
            my_slot.status = "SWAPPABLE"
            their_slot.status = "SWAPPABLE"
            my_slot.save()
            their_slot.save()
            swap_request.save()

        return Response(SwapRequestSerializer(swap_request).data)


class MySwapRequestsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        incoming = SwapRequest.objects.filter(to_user=request.user)
        outgoing = SwapRequest.objects.filter(from_user=request.user)
        return Response({
            "incoming": SwapRequestSerializer(incoming, many=True).data,
            "outgoing": SwapRequestSerializer(outgoing, many=True).data
        })
