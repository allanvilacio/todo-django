from django.urls import path
from . import views


urlpatterns = [
    path('', views.todo_home, name='todo-home'),
    path('complated/', views.todo_complated, name='todo-complated'),
    path('list-todos/', views.list_todos, name='list-todos'),
    path('todo/', views.todo, name='todo'),
]



