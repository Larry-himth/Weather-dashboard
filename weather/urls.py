from django.urls import path
from . import views

urlpatterns = [
    path('current/<str:location>/', views.current_weather, name='current_weather'),
    path('forecast/<str:location>/', views.forecast, name='forecast'),
    path('search/', views.search_locations, name='search_locations'),
    path('export/', views.export_data, name='export_data'),
    path('export-history/', views.export_history, name='export_history'),
]
