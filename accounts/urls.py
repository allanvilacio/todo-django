from django.urls import path
from . import views


urlpatterns = [
    path('login/', views.login_todo, name='login'),
    path('logout/', views.logout_todo, name='logout')
]
