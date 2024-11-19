from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
import json
from .models import Todo
from django.core.serializers import serialize
from django.utils import timezone


def convert_empty_to_none(value):
    return None if value == "" else value


@login_required
def todo_home(request):
    return render(request, 'todo/home.html')

@login_required 
def todo_concluidas(request):
    return render(request, 'todo/concluidas.html')

@login_required 
def listar_todos(request):
    body = json.loads(request.body)

    if body.get('path')=='/concluidas/':
        todos = Todo.objects.filter(data_conclusao__isnull=False, user_id= request.user.id)
        todos =list(todos.values())
        return JsonResponse({'status':200, 'data':todos})
    elif body.get('path')=='/':
        todos = Todo.objects.filter(data_conclusao__isnull=True, user_id= request.user.id)
        todos =list(todos.values())
        return JsonResponse({'status':200, 'data':todos})

@login_required
def todo(request):
    
    body = json.loads(request.body)
    if request.method=='POST':
        todo = Todo(
            titulo=body.get('titulo'),
            detalhe=convert_empty_to_none(body.get('detalhe', None)),
            data_entrega = convert_empty_to_none(body.get('data_entrega', None)),
            user_id = request.user.id
             
        )
        todo.save()
        
        return JsonResponse({'status':200})

    if request.method=='PUT':
        print(body)
        todo = Todo.objects.get(id=body.get('pk'))
        todo.titulo = convert_empty_to_none(body.get('titulo', None))
        todo.data_entrega=convert_empty_to_none(body.get('data_entrega', None))
        todo.detalhe = convert_empty_to_none(body.get('detalhe', None))
        todo.save()
        return JsonResponse({'status':200})
    
    if request.method=='DELETE':
        
        todo = Todo.objects.get(id=body.get('pk'))
        todo.delete()

        return JsonResponse({'status':200})
    
    if request.method=='PATCH':
        body = json.loads(request.body)

        todo = Todo.objects.get(pk=body['key'])
        
        if todo.data_conclusao==None:
            todo.data_conclusao = timezone.now().replace(microsecond=0)
            content = {'status':200}
        else:
            todo.data_conclusao = None
            content = {'status':200}

        todo.save()
        return JsonResponse(content)

