from django.shortcuts import render,redirect,render_to_response,get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.views.decorators.http import require_GET,require_POST
from django.contrib.auth import authenticate,login,logout
from django.core.mail import send_mail
from django.template import RequestContext

# Create your views here.
from account.models import MyUser
from message.models import Message
from chat.models import Chat
from chat.models import SingleChat

from .forms import LoginForm,SignUp,ChangePassword,UsernameFp
import random
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5
from base64 import *
from Crypto import Random

@require_GET
def show_login(request):
	if not request.user.is_authenticated():
		f=LoginForm();
		context = { 'f' : f }
		return render(request,'account/login.html',context)
	else:
		return redirect('account.views.user_welcome')


@require_POST
def user_login(request):
	username=request.POST['username']
	password=request.POST['password']
	user=authenticate(username=username,password=password)
	f=LoginForm(request.POST);
	if user:
		login(request,user)
		x=redirect('account.views.user_welcome')
		x.set_cookie('username',username)
		return x
	else:
		context = { 'f' : f , 'x':'The username or password is incorrect','user':user}
		return render_to_response('account/login.html',context,context_instance=RequestContext(request))



@require_GET
def show_signup(request):
	if request.user.is_authenticated():
		return redirect('account.views.user_welcome')
	f=SignUp()
	context = {'f':f}
	return render(request,'account/signup.html',context)

@require_POST
def user_signup(request):
	f=SignUp(request.POST,request.FILES)
	if f.is_valid():
		user=f.save(commit=False)
		user.set_password(f.cleaned_data['password'])
		private = RSA.generate(1024)
		public  = private.publickey()
		user.privatekey=private.exportKey('PEM')
		user.publickey=public.exportKey(format='PEM')
		user.save()
		
		message='Welcome to Chat-messenger.Your signup is successful.'
		return user_welcome(request,message)
	context={'f':f}
	return render(request,'account/signup.html',context)


@login_required
def user_welcome(request,message=''):
	context={'imgurl':request.user.profilepic.url,'Username':request.user.username,'message':message}
	return render(request,'chat/wall.html')


@login_required
def user_logout(request):
	logout(request)
	x=redirect('account.views.show_login')
	x.delete_cookie('username')
	return x
'''
@login_required
@require_GET
def show_changepassword(request):
	f=ChangePassword()
	context={'f':f,'hi':'Hi,%s'%request.user.username}
	return render(request,'account/change.html',context)

@login_required	
def user_changepassword(request):
	f=ChangePassword(request.POST)
	if f.is_valid():
		user=request.user
		user.set_password(f.cleaned_data['password'])
		user.save()
		request.session['temp_data'] = f.cleaned_data
		message='Your password is changed successfully.'
		return user_welcome(request,message)
	context={'f':f}
	return render(request,'account/change.html',context)

@require_GET
def username_fp(request):
	f=UsernameFp()
	context={'message':'Enter a Valid Username.','f':f}
	return render(request,'account/usernamefp.html',context)

@require_POST
def user_fp(request):
	username=request.POST['username']
	f=UsernameFp(request.POST)
	if f.is_valid():
		x=redirect('account.views.forget_password')
		x.set_cookie('username',username)
		return x
	context={'f':f}
	return render(request,'account/usernamefp.html',context)

@require_GET
def forget_password(request):
	x=str(int(10000*random.random()))
	username=request.COOKIES['username']
	user=get_object_or_404(MyUser,username=username)
	send_mail('Quoraforgetpassword', 'Hi %s,Please enter this security code %s  in your page' %(user.username,x),'savilpython@gmail.com' , [user.email],fail_silently=False)
	user.token=x
	user.save()
	message="An email has been sent to your registered email with a security code"
	context={'message':message}
	return render(request,'account/forgetpassword.html',context)



@require_POST
def userforget(request):
	username=request.COOKIES['username']
	user=get_object_or_404(MyUser,username=username)
	if request.POST['securitycode'] == user.token:
		user.token=''		
		x=str(int(10000*random.random()))
		user.set_password(x)
		user.save()
		userw=authenticate(username=username,password=x)
		if userw:
			login(request,userw)
			return  redirect('account.views.show_changepassword')
			
	message="The secutiy code didn't match"
	context={'message':message}
	return render_to_response('account/forgetpassword.html',context,context_instance=RequestContext(request))



'''