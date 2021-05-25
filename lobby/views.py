from django.shortcuts import render, redirect
from django.http import HttpResponse
from authenticate.models import UserModel
from lobby.models import LobbyModel

import json

# Create your views here.

def index(request):
	lobbies = LobbyModel.objects.all()#[0:5]
	context_dict = {'lobbies':lobbies}
	return render(request, 'lobby/lobby.html', context_dict)

def room(request, room_name):
	current_user = request.GET.get('username', '')
	user = UserModel.objects.get(username=current_user)

	token = user.a_token
	master_slave = user.master_slave

	context_dict = {
		'room_name':room_name,
		'token':token,
		'mors':master_slave
	}
	return render(request, 'lobby/room.html', context_dict)

def classifyData(request, room_name):
	if request.method == 'POST':
		lobbies = LobbyModel.objects.all()
		exists = False
		response_data = {}

		for x in lobbies:
			if str(x) == room_name:
				exists = True

		if exists == False:
			current_lobby = LobbyModel(lobbyname=room_name)
			current_lobby.save()
			response_data['result'] = 'lobby made successfully'

		else:
			response_data['result'] = 'lobby already exists'

		response_data['lobbyname'] = room_name

		return HttpResponse(json.dumps(response_data), content_type='application/json')

	else:
		return HttpResponse(json.dumps({'nothing to see':'nothing happened'}), content_type='application/json')

def roomDelete(request, room_name):
	if request.method == 'POST':
		current_user = request.POST.get('username')
		
		try:
			lobby = LobbyModel.objects.get(lobbyname=room_name)
			lobby.delete()
		except:
			pass

		response_data = {}

		response_data['url'] = 'http://127.0.0.1:8000/lobby/?username={}'.format(current_user) 

		return HttpResponse(json.dumps(response_data), content_type='application/json')
	else:
		return HttpResponse(json.dumps({'nothing to see':'nothing happened'}), content_type='application/json')
