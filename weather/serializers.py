from rest_framework import serializers
from .models import WeatherCache, ExportRecord

class WeatherCacheSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeatherCache
        fields = ['location', 'data_type', 'data', 'created_at']

class ExportRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExportRecord
        fields = ['id', 'location', 'start_date', 'end_date', 'format', 'created_at', 'data_rows']
