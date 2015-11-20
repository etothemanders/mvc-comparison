from django.shortcuts import render


def index(request):
    return render(request, 'mvcs/index.html', {})

def backbone(request):
    return render(request, 'mvcs/backbone.html', {})
