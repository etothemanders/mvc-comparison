from django.conf.urls import url

from . import views, api


urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^backbone/', views.backbone, name='backbone'),
    url(r'^items/', api.items, name='items')
]