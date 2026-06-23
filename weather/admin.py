from django.contrib import admin
from .models import WeatherCache, ExportRecord

@admin.register(WeatherCache)
class WeatherCacheAdmin(admin.ModelAdmin):
    list_display = ('location', 'data_type', 'created_at', 'expires_at')
    list_filter = ('data_type', 'created_at')
    search_fields = ('location',)

@admin.register(ExportRecord)
class ExportRecordAdmin(admin.ModelAdmin):
    list_display = ('location', 'start_date', 'end_date', 'format', 'created_at', 'data_rows')
    list_filter = ('format', 'created_at')
    search_fields = ('location',)
