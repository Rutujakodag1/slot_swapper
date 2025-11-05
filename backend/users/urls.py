from django.urls import path
from .views import RegisterView, LoginView,EventListCreateView, EventRetrieveUpdateDestroyView,SwappableSlotsView,SwapRequestView,SwapResponseView,MySwapRequestsView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path("events/", EventListCreateView.as_view(), name="event-list-create"),
    path("events/<int:pk>/", EventRetrieveUpdateDestroyView.as_view(), name="event-detail"),
    path("swappable-slots/", SwappableSlotsView.as_view(), name="swappable-slots"),
    path("swap-request/", SwapRequestView.as_view(), name="swap-request"),
    path("swap-response/<int:request_id>/", SwapResponseView.as_view(), name="swap-response"),
    path("my-swap-requests/", MySwapRequestsView.as_view()),

]
