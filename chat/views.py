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
from django.utils.dateparse import parse_datetime
import datetime
from django.utils.timezone import utc

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
		t['user']={"pk":sw.pk,"username":sw.username,"first_name":sw.first_name,"last_name":sw.last_name,"email":sw.email,"contact":sw.contact,"profilepic":"media/"+str(sw.profilepic)}
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
	s2 = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S") # end time, together covers 1 day
	g={"list":q+r,"lastnotification":str(s2)}
	data=g
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
			d["created_by"]={"pk":w.id,"username":w.username,"profilepic":"media/"+str(w.profilepic)}
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
			d["created_by"]={"pk":w.id,"username":w.username,"profilepic":"media/"+str(w.profilepic)}
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
	data={"pk":a.pk,"username":a.username,"first_name":a.first_name,"last_name":a.last_name,"email":a.email,"contact":a.contact,"profilepic":"media/"+str(a.profilepic)}
	return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
@require_POST
@csrf_exempt
def get_useritself(request):
	a=MyUser.objects.get(username=request.user)
	data={"pk":a.pk,"username":a.username,"first_name":a.first_name,"last_name":a.last_name,"email":a.email,"contact":a.contact,"profilepic":"media/"+str(a.profilepic)}
	return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
@require_POST
@csrf_exempt
def create_singlechat(request):
	userpk=request.POST['username']
	user=request.user
	t={}
	try:
		b=MyUser.objects.get(username=userpk)
		owner=request.user
		a=SingleChat()
		a.save()
		a.user.add(b,owner)
		t["type"]=1
		t["pk"]= a.pk
		t["last_modified"]=str(a.last_modified)
		t["title"]=a.title
		sw=MyUser.objects.get(id=b.id)
		try:
			me=a.chat_singlemessages.latest('created_at').text
		except:
			me="Start a conversation"
		t["message"]=me
		t['user']={"pk":sw.pk,"username":sw.username,"first_name":sw.first_name,"last_name":sw.last_name,"email":sw.email,"contact":sw.contact,"profilepic":"media/"+str(sw.profilepic)}
		data={"chat":t,"form":{"messageform":"Chat for this user added successfully"}}
	except:
		t["type"]=0
		data={"chat":t,"form":{"messageform":"User not found.Try other Username"}}
	return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def create_groupchat(request):
	title=request.GET['title']
	owner=request.user
	a=Chat(owner=owner,title=title)
	a.save()
	a.users.add(owner)
	t={}
	t["type"]=0
	t["pk"]= a.pk
	t["last_modified"]=str(a.last_modified)
	t["title"]=a.title
	t["icon"]=str(a.icon)
	t['users']=str(a.users.values_list('id', flat=True).order_by('id'))
	try:
		me=a.chat_messages.latest('created_at').text
	except:
		me="Start a conversation"
	t["message"]=me
	data={"chat":t,"form":{"messageform":"Group created successfully"}}
	return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def add_groupchat(request):
	username=request.GET['username']
	chat=request.GET['chatpk']
	a=Chat.objects.get(id=chat)
	b=MyUser.objects.get(username=username)
	try:
		a.users.get(username=username)
		data={"messageform":"Member already added to Group."}
	except :
		a.users.add(b)
		data={"messageform":"Member successfully added to Group."}
	return HttpResponse(json.dumps(data),content_type="application/json")

@login_required
def exit_groupchat(request):
	pk=request.GET['chatpk']
	user=request.user
	print(pk)
	print(user)
	a=Chat.objects.get(id=pk)
	print(a)
	a.users.remove(user)
	x=a.users.all().count();
	print(x)
	if x==0:
		a.delete();
	else:
		y=a.users.all();
		y=y[0];
		print(y)
		a.owner=y;
	data={"messageform":"successfully removed"}
	return HttpResponse(json.dumps(data),content_type="application/json")
@login_required
def notifications(request):
	date=request.GET['laststamp']
	user=request.user
	s1 = date # start time
	s2 = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f") # end time, together covers 1 day
	n1 = parse_datetime(s1) 
	n2 = parse_datetime(s2)-datetime.timedelta(microseconds=1)
	a=user.chatrooms.all()
	b=user.singlechatrooms.all()
	r=[]
	for x in b:
		t={}
		we=x.user.all()
		if we[0].id==user.pk:
			te=we[1].id
		else :
			te=we[0].id
		sw=MyUser.objects.get(id=te)
		t["id"]="chatx1x2x3x41x1x2x3x4"+str(x.pk)+"x1x2x3x4"+str(sw.profilepic)+"x1x2x3x4"+sw.username
		y=x.chat_singlemessages.filter(created_at__range=(n1,n2))
		s=[]
		for z in y:
			d={}
			d["text"]=z.text
			w=z.created_by
			if w.username!=user.username:
				d["created_by"]={"pk":w.id,"username":w.username,"profilepic":"media/"+str(w.profilepic)}
				d["created_at"]=str(z.created_at)
				d["chat"]=z.chat.id
				d["pk"]=z.id
				d["type"]=1
				s.append(d)
		t["messages"]=s;
		r.append(t);
	for x in a:
		t={}
		t["id"]="chatx1x2x3x40x1x2x3x4"+str(x.pk)+"x1x2x3x4"+str(x.icon)+"x1x2x3x4"+x.title
		y=x.chat_messages.filter(created_at__range=(n1,n2))
		s=[]
		for z in y:
			d={}
			d["text"]=z.text
			w=z.created_by
			if w.username!=user.username:
				d["created_by"]={"pk":w.id,"username":w.username,"profilepic":"media/"+str(w.profilepic)}
				d["created_at"]=str(z.created_at)
				d["chat"]=z.chat.id
				d["pk"]=z.id
				d["type"]=0
				s.append(d)
		t["messages"]=s;
		r.append(t);
	g={"list":r,"lastnotification":str(s2)}
	data=g;
	return HttpResponse(json.dumps(data),content_type="application/json")


@require_GET
def get_public_key(request):
	pk=request.GET['pk']
	a=SingleChat.objects.get(id=pk)
	lusers=a.user.all()         #decryption starts
	keyuser={}
	print (lusers)
	print (request.user.id)
	if lusers[0].id==request.user.id:
		keyuser=lusers[1]
	else:
		keyuser=lusers[0]
	key=keyuser.publickey
	data={"key":key}
	return HttpResponse(json.dumps(data),content_type="application/json")

