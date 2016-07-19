from django.conf.urls import url
from django.contrib import admin
from .views import get_chats

urlpatterns = [
    url(r'^get_chats/$',get_chats,name="get_chats"),
]
