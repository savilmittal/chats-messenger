from django.contrib import admin
from .models import Message,SingleMessage
# Register your models here.

admin.site.register(Message)
admin.site.register(SingleMessage)