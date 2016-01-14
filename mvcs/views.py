from django.shortcuts import render
from django.template.context_processors import csrf


def index(request):
    return render(request, 'mvcs/index.html', {})


def backbone(request):
    context = {}
    context.update(csrf(request))
    return render(request, 'mvcs/backbone.html', context)


def slideshow(request):
    return render(request, 'mvcs/slideshow.html')


def angular_tut1(request):
    return render(request, 'mvcs/angular_tut1.html')


def react(request):
    return render(request, 'mvcs/react.html')


def angular(request):
    return render(request, 'mvcs/angular.html')
