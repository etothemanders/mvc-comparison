from django.conf.urls import url

from . import views, api


urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^backbone/', views.backbone, name='backbone'),
    url(r'^items/(?P<item_id>[0-9]+)?', api.items, name='items')
]