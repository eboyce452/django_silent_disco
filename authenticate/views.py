from django.shortcuts import render
from django.http import HttpResponse
from authenticate.forms import UserForm
from authenticate.models import UserModel

import json

# Create your views here.

def authenticationHome(request):
	form = UserForm()

	return render(request, 'authenticate/authenticate.html',{'form':form})

def jsonData(request):
	if request.method == 'POST':
		new_user = request.POST.get('username')
		user_password = request.POST.get('password')
		user_token = request.POST.get('user_token')
		user_rtoken = request.POST.get('user_refresh_token')
		new_user_model = UserModel(username=new_user,password=user_password,a_token=user_token,r_token=user_rtoken)
		new_user_model.save()

		response_data = {}

		response_data['result'] = 'Create post successful'
		response_data['username'] = new_user
		response_data['password'] = user_password
		response_data['access_token'] = user_token
		response_data['refresh_token'] = user_rtoken

		return HttpResponse(json.dumps(response_data), content_type='application/json')
	
	else:
		return HttpResponse(json.dumps({'nothing to see':'nothing happened'}), content_type='application/json')


# def refreshToken(request):
# 	return render(request, 'authenticate/refresh_token.html')