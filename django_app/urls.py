from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from weather.views import ReactAppView
from django.urls import path
from weather.views import home

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/weather/', include('weather.urls')),
    path('', ReactAppView.as_view()),
    path('', home, name='home'),
]

# Handle static files
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Fallback for any other route - serve React index.html for client-side routing
urlpatterns += [
    path('<path:path>', ReactAppView.as_view()),
]
