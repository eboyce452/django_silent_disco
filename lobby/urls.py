from django.urls import include, path, re_path
from django.contrib import admin
from lobby import views

urlpatterns = [
    path('', views.index, name='index'),
    path('<str:room_name>/', views.room, name='room'),
]