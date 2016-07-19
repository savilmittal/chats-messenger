from django.shortcuts import render,redirect,render_to_response,get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.views.decorators.http import require_GET,require_POST
from django.contrib.auth import authenticate,login,logout
from django.core.mail import send_mail
from django.template import RequestContext
from django.core import serializers
import json
# Create your views here.
from account.models import MyUser
from message.models import Message
from chat.models import Chat
from chat.models import SingleChat

@login_required
#@require_POST
def get_chats(request):
	user=request.user
	a=user.chatrooms.filter()
	b=user.singlechatrooms.filter()
	data=list(b)+list(a)
	data=serializers.serialize("json",data)
	return HttpResponse(data,content_type="application/json")

@login_required
def get_chatroom_messages(request):
	pk=request.GET['pk']
	ty=request.GET['type']
	if ty==1:
		SingleChat.objects.get(pk=1).messages