from django.shortcuts import render,redirect,render_to_response,get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.views.decorators.http import require_GET,require_POST
from django.views.decorators.csrf import csrf_exempt
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
from message.models import SingleMessage
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5
from base64 import *
from Crypto import Random

def decrypt(key, text):
    rsakey = RSA.importKey(key)
    rsakey = PKCS1_v1_5.new(rsakey)
    sentinel = Random.new().read(1024)
    d = rsakey.decrypt(text,sentinel)
    return d



@login_required
@require_POST
@csrf_exempt
def save_message(request):
	pk=request.POST['pk']
	ty=request.POST['type']
	message=request.POST['message']
	print(pk)
	print(ty)
	d={}
	if ty=='1':
		a=SingleChat.objects.get(id=pk)
		lusers=a.user.all()          #decryption starts
		keyuser={}
		if lusers[0].id==request.user.id:
			keyuser=lusers[1]
		else:
			keyuser=lusers[0]
		key=keyuser.privatekey
		message = b64decode(message.encode())
		message=decrypt(key,message)#decryption ends
		message=message.decode("utf-8")
		b=SingleMessage(text=message,created_by=request.user,chat=a)
		b.save()
		d["type"]=1
	else :
		a=Chat.objects.get(id=pk)
		b=Message(text=message,created_by=request.user,chat=a)
		b.save()
		d["type"]=0
	d["text"]=b.text
	w=b.created_by
	d["created_by"]={"pk":w.id,"username":w.username,"profilepic":str(w.profilepic)}
	d["created_at"]=str(b.created_at)
	d["chat"]=b.chat.id
	d["pk"]=b.id
	print(message)
	return HttpResponse(json.dumps(d),content_type="application/json")