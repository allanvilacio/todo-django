from django.db import models
from django.contrib.auth.models import User


class Todo(models.Model):
    titulo = models.CharField(max_length=200, blank=False, null=False)
    detalhe = models.TextField(null=True, blank=False)
    data_entrega = models.DateTimeField(null=True, blank=False)
    data_conclusao = models.DateTimeField(null=True,  blank=False)
    user = models.ForeignKey(User, on_delete=models.PROTECT)