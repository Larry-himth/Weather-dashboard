import csv
import logging
from io import StringIO, BytesIO
from django.http import HttpResponse
from django.views.generic import View
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from openpyxl import Workbook
from .openweather_client import OpenWeatherMapClient
from .models import ExportRecord
from .serializers import ExportRecordSerializer
from pathlib import Path
from django.shortcuts import render

logger = logging.getLogger(__name__)

def home(request):
    # This instructs Django to look inside your configured template directories for index.html
    return render(request, 'index.html')

@api_view(['GET'])
def current_weather(request, location):
    try:
        client = OpenWeatherMapClient()
        data = client.get_current_weather(location)
        return Response(data)
    except Exception as e:
        logger.error(f"Error in current_weather: {e}")
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def forecast(request, location):
    try:
        client = OpenWeatherMapClient()
        data = client.get_forecast(location)
        return Response(data)
    except Exception as e:
        logger.error(f"Error in forecast: {e}")
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def search_locations(request):
    query = request.query_params.get('q', '')
    if not query or len(query) < 2:
        return Response({'error': 'Query must be at least 2 characters'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        client = OpenWeatherMapClient()
        locations = client.search_locations(query)
        return Response({'locations': locations})
    except Exception as e:
        logger.error(f"Error searching locations: {e}")
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def export_data(request):
    try:
        location = request.data.get('location', '')
        start_date = request.data.get('start_date', '')
        end_date = request.data.get('end_date', '')
        export_format = request.data.get('format', 'csv').lower()

        if not location or not start_date or not end_date:
            return Response({'error': 'location, start_date, end_date required'}, status=status.HTTP_400_BAD_REQUEST)

        if export_format not in ['csv', 'excel']:
            return Response({'error': 'format must be csv or excel'}, status=status.HTTP_400_BAD_REQUEST)

        sample_data = [
            {'date': start_date, 'temp': 20.5, 'humidity': 65, 'condition': 'Partly Cloudy'},
            {'date': start_date, 'temp': 21.0, 'humidity': 63, 'condition': 'Partly Cloudy'},
        ]

        if export_format == 'csv':
            output = StringIO()
            writer = csv.DictWriter(output, fieldnames=['date', 'temp', 'humidity', 'condition'])
            writer.writeheader()
            writer.writerows(sample_data)

            response = HttpResponse(output.getvalue(), content_type='text/csv')
            response['Content-Disposition'] = f'attachment; filename="{location}_weather.csv"'
        else:
            wb = Workbook()
            ws = wb.active
            ws.title = "Weather Data"
            ws.append(['Date', 'Temperature', 'Humidity', 'Condition'])
            for row in sample_data:
                ws.append([row['date'], row['temp'], row['humidity'], row['condition']])

            output = BytesIO()
            wb.save(output)
            output.seek(0)

            response = HttpResponse(output.getvalue(), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            response['Content-Disposition'] = f'attachment; filename="{location}_weather.xlsx"'

        ExportRecord.objects.create(
            location=location,
            start_date=start_date,
            end_date=end_date,
            format=export_format,
            data_rows=len(sample_data)
        )

        return response
    except Exception as e:
        logger.error(f"Error in export_data: {e}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def export_history(request):
    try:
        records = ExportRecord.objects.all()[:20]
        serializer = ExportRecordSerializer(records, many=True)
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error in export_history: {e}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ReactAppView(View):
    """Serve the React app's built index.html without Django template processing"""
    
    def get(self, request, path=''):
        # Check dev build output directory first, then fallback to STATIC_ROOT
        dev_index_path = Path(settings.BASE_DIR) / 'weather' / 'static' / 'index.html'
        prod_index_path = Path(settings.STATIC_ROOT) / 'index.html'
        
        index_path = dev_index_path if dev_index_path.exists() else prod_index_path
        
        if index_path.exists():
            with open(index_path, 'r') as f:
                content = f.read()
            return HttpResponse(content, content_type='text/html')
        else:
            return HttpResponse('<h1>React app not built yet</h1><p>Run: npm run build</p>', 
                              content_type='text/html', status=404)
