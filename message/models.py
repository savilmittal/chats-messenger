from django.db import models
from django.utils import timezone
import pytz

timezone.activate(pytz.timezone("Asia/Kolkata"))
timezone.localtime(timezone.now())
# Create your models here.
class Message(models.Model):
	text=models.CharField(max_length=1000)
	created_by=models.ForeignKey("account.MyUser",related_name="user_messages")
	created_at=models.DateTimeField(auto_now_add=True)
	chat=models.ForeignKey("chat.Chat",related_name="chat_messages")
	def __str__(self):
		return self.text +" | "+self.chat.title+ "|"+self.created_by.username+"|"+str(self.created_at)

class SingleMessage(models.Model):
	text=models.CharField(max_length=1000)
	created_by=models.ForeignKey("account.MyUser",related_name="user_singlemessages")
	created_at=models.DateTimeField(auto_now_add=True)
	chat=models.ForeignKey("chat.SingleChat",related_name="chat_singlemessages")
	def __str__(self):
		return self.text +" | "+self.chat.title+ "|"+self.created_by.username+"|"+str(self.created_at)
