from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    
    def __str__(self):
        return self.username

class Event(models.Model):
    STATUS_CHOICES = [
        ("BUSY", "Busy"),
        ("SWAPPABLE", "Swappable"),
        ("SWAP_PENDING", "Swap Pending"),
    ]

    title = models.CharField(max_length=255)
    startTime = models.DateTimeField()
    endTime = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="BUSY")
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="events")

    def __str__(self):
        return f"{self.title} ({self.owner.username})"


class SwapRequest(models.Model):
    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("ACCEPTED", "Accepted"),
        ("REJECTED", "Rejected"),
    ]

    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_requests")
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_requests")
    my_slot = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="my_swap_requests")
    their_slot = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="their_swap_requests")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PENDING")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"SwapRequest from {self.from_user.username} to {self.to_user.username}"