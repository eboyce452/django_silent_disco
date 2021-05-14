from django.shortcuts import render
from authenticate.models import UserModel

# Create your views here.

def index(request):
	return render(request, 'lobby/index.html')

def room(request, room_name):
	return render(request, 'lobby/room.html', {'room_name':room_name})