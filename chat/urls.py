from django.conf.urls import url
from django.contrib import admin
from .views import get_chats,get_chatroom_messages,get_user,create_singlechat,create_groupchat,add_groupchat,exit_groupchat,get_useritself,notifications,get_public_key

urlpatterns = [
    url(r'^get_chats$',get_chats,name="get_chats"),
    url(r'^notifications/$',notifications,name="notifications"),
    url(r'^get_useritself$',get_useritself,name="get_useritself"),
    url(r'^exit_groupchat/$',exit_groupchat,name="exit_groupchat"),
    url(r'^add_groupchat/$',add_groupchat,name="add_groupchat"),
    url(r'^create_singlechat$',create_singlechat,name="create_singlechat"),
    url(r'^create_groupchat/$',create_groupchat,name="create_groupchat"),
    url(r'^get_user/$',get_user,name="get_user"),
    url(r'^publickey/$',get_public_key,name="get_public_key"),
    url(r'^get_chatroom_messages$',get_chatroom_messages,name="get_chatroom_messages"),
]
