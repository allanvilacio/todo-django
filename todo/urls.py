from django.urls import path
from . import views


urlpatterns = [
    path('', views.todo_home, name='todo-home'),
    path('concluidas/', views.todo_concluidas, name='todo-concluidas'),
    path('listar-todos/', views.listar_todos, name='listar-todos'),
    path('todo/', views.todo, name='todo'),
]



