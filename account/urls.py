"""Quora URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from .views import show_login,user_login,user_logout,user_signup,show_signup,user_welcome
urlpatterns = [
	url(r'^login/$',user_login,name='login'),
    url(r'^usersignup/$',user_signup,name='usersignup'),
    url(r'^welcome/$',user_welcome,name='welcome'),
    url(r'^signup/$',show_signup,name='signup'),
	url(r'^logout/$',user_logout,name='logout'),
]
