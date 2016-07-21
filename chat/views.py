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
from message.models import SingleMessage
from chat.models import Chat
from chat.models import SingleChat

@login_required
@require_POST
@csrf_exempt
def get_chats(request):
	user=request.user
	a=user.chatrooms.filter()
	b=user.singlechatrooms.all()
	q=[]
	for x in b:
		t={}
		t["type"]=1
		t["pk"]= x.pk
		t["last_modified"]=str(x.last_modified)
		t["title"]=x.title
		we=x.user.all()
		if we[0].id==user.pk:
			te=we[1].id
		else :
			te=we[0].id
		sw=MyUser.objects.get(id=te)
		try:
			me=x.chat_singlemessages.latest('created_at').text
		except:
			me="Start a conversation"
		t["message"]=me
		t['user']={"pk":sw.pk,"username":sw.username,"first_name":sw.first_name,"last_name":sw.last_name,"email":sw.email,"contact":sw.contact,"profilepic":str(sw.profilepic)}
		q.append(t)
	r=[]
	for x in a:
		t={}
		t["type"]=0
		t["pk"]= x.pk
		t["last_modified"]=str(x.last_modified)
		t["title"]=x.title
		t["icon"]=str(x.icon)
		t['users']=str(x.users.values_list('id', flat=True).order_by('id'))
		try:
			me=x.chat_messages.latest('created_at').text
		except:
			me="Start a conversation"
		t["message"]=me
		r.append(t)
	data=q+r
	return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
@require_POST
@csrf_exempt
def get_chatroom_messages(request):
	pk=request.POST['pk']
	ty=request.POST['type']
	print(pk)
	print(ty)
	r=[]
	if ty=='1':
		a=SingleChat.objects.get(id=pk).chat_singlemessages.all()
		for x in a:
			d={}
			d["text"]=x.text
			w=x.created_by
			d["created_by"]={"pk":w.id,"username":w.username,"profilepic":str(w.profilepic)}
			d["created_at"]=str(x.created_at)
			d["chat"]=x.chat.id
			d["pk"]=x.id
			d["type"]=1
			r.append(d)
	else:
		a=Chat.objects.get(id=pk).chat_messages.all()
		for x in a:
			d={}
			d["text"]=x.text
			w=x.created_by
			d["created_by"]={"pk":w.id,"username":w.username,"profilepic":str(w.profilepic)}
			d["created_at"]=str(x.created_at)
			d["chat"]=x.chat.id
			d["pk"]=x.id
			d["type"]=0
			r.append(d)
	data=r
	return HttpResponse(json.dumps(r),content_type="application/json")

@login_required
def get_user(request):
	user=request.GET['user']
	print(user)
	a=MyUser.objects.get(username=user)
	data={"pk":a.pk,"username":a.username,"first_name":a.first_name,"last_name":a.last_name,"email":a.email,"contact":a.contact,"profilepic":str(a.profilepic)}
	return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
@require_POST
@csrf_exempt
def get_useritself(request):
	a=MyUser.objects.get(username=request.user)
	data={"pk":a.pk,"username":a.username,"first_name":a.first_name,"last_name":a.last_name,"email":a.email,"contact":a.contact,"profilepic":str(a.profilepic)}
	return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def create_singlechat(request):
	userpk=request.GET['pk']
	b=MyUser.objects.get(id=userpk)
	owner=request.user
	a=SingleChat()
	a.save()
	a.user.add(b,owner)
	data={"message":"success"}
	return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def create_groupchat(request):
	userpklist=request.GET['pk']
	title=request.GET['title']
	print(userpklist)
	print(title)
	q=[]
	q=userpklist.split(',')
	print(q)
	b=[]
	for i in q:
		b.append(MyUser.objects.get(id=i))
	owner=request.user
	a=Chat(owner=owner,title=title)
	a.save()
	a.users.add(owner)
	for x in b:
		a.users.add(x)
	data={"message":"success"}
	return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def add_groupchat(request):
	pk=request.GET['pk']
	chat=request.GET['chatpk']
	print(pk)
	print(chat)
	a=Chat.objects.get(id=chat)
	b=MyUser.objects.get(id=pk)
	a.users.add(b)
	data={"message":"success"}
	return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def exit_groupchat(request):
	pk=request.GET['pk']
	user=request.user
	print(pk)
	print(user)
	a=Chat.objects.get(id=pk)
	a.users.remove(user)
	data={"message":"success"}
	return HttpResponse(json.dumps(data),content_type="application/json")

