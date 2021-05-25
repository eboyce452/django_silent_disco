from django.urls import include, path, re_path
from django.contrib import admin
from lobby import views

urlpatterns = [
    path('', views.index, name='index'),
    path('<str:room_name>/', views.room, name='room'),
    path('<str:room_name>/classification_data/', views.classifyData, name='classifydata'),
    path('<str:room_name>/room_delete/', views.roomDelete, name='roomdelete'),
]
