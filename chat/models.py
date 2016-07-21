from django.db import models

# Create your models here.,
class Chat(models.Model):
	owner=models.ForeignKey("account.MyUser",related_name="admin",null=True,blank=True)
	users=models.ManyToManyField("account.MyUser",related_name="chatrooms")
	created_on=models.DateTimeField(auto_now_add=True)
	last_modified=models.DateTimeField(auto_now=True)
	icon=models.ImageField("Group Photo",upload_to="static/profilepics",default="static/profilepics/pp.jpg")
	title=models.CharField(max_length=20,default="Group name")
	def __str__(self):
		return self.title

#>>> Chat.objects.filter(users=a).filter(users=b,_type="SI")
class SingleChat(models.Model):
	user=models.ManyToManyField("account.MyUser",related_name="singlechatrooms")
	created_on=models.DateTimeField(auto_now_add=True)
	last_modified=models.DateTimeField(auto_now=True)
	title=models.CharField(max_length=20,default="SingleChat",blank=True)
	def __str__(self):
		return self.title