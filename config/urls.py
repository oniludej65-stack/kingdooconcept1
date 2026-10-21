from django.contrib import admin
from django.urls import include, path
from core.views import home, portfolio, about, contact


urlpatterns = [
    path('i18n/', include('django.conf.urls.i18n')),
    path('admin/', admin.site.urls),

    path('', home, name='home'),

    path('portfolio/', portfolio, name='portfolio'),

    path('about/', about, name='about'),

    path('contact/', contact, name='contact'),
]
