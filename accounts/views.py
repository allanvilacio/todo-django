from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout



def login_todo(request):
    if request.method=='POST':
        username = request.POST['usuario']
        password = request.POST['senha']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('todo-home')
        else:
            return render(request, 'accounts/login.html',
                          {'msg':'Usuario ou senha invalido.'})
    else:
        return render(request, 'accounts/login.html')

def logout_todo(request):
    print('logout')
    logout(request)
    return redirect('login')