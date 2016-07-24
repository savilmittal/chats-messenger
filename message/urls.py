from django.conf.urls import url
from django.contrib import admin
from .views import save_message

urlpatterns = [
    url(r'^save_message$',save_message,name="save_message"),
]