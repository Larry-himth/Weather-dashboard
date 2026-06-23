from django.db import models
from django.utils import timezone
from datetime import timedelta
import json

class WeatherCache(models.Model):
    location = models.CharField(max_length=255, db_index=True)
    data_type = models.CharField(
        max_length=20,
        choices=[('current', 'Current'), ('forecast', 'Forecast'), ('historical', 'Historical')],
        db_index=True
    )
    data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    expires_at = models.DateTimeField(db_index=True)

    class Meta:
        unique_together = ('location', 'data_type')
        indexes = [
            models.Index(fields=['location', 'data_type', 'expires_at']),
        ]

    def is_expired(self):
        return timezone.now() > self.expires_at

    def __str__(self):
        return f"{self.location} - {self.data_type}"


class ExportRecord(models.Model):
    location = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()
    format = models.CharField(max_length=10, choices=[('csv', 'CSV'), ('excel', 'Excel')])
    created_at = models.DateTimeField(auto_now_add=True)
    data_rows = models.IntegerField(default=0)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.location} ({self.start_date} to {self.end_date}) - {self.format}"
