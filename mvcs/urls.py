from django.conf.urls import url

from . import views, api


urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^angular-tut1/', views.angular_tut1, name='angular_tut1'),
    url(r'^backbone/', views.backbone, name='backbone'),
    url(r'^items/(?P<item_id>[0-9]+)?', api.items, name='items'),
    url(r'^react/$', views.react, name='react'),
    url(r'^slideshow/', views.slideshow, name='slideshow')
]
