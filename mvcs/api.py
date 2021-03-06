import simplejson

from django.http import JsonResponse

from models import Item


def items(request, item_id=None):
    if request.method == 'POST':
        data = request.POST
        item = Item(name=data.get('name'), quantity=data.get('quantity'))
        item.add()
    if request.method == 'DELETE':
        item = Item.objects.get(pk=item_id)
        item.delete()
    if request.method == 'PUT':
        data = simplejson.loads(request.body)
        item = Item.objects.get(pk=data.get('id'))
        item.purchased = data.get('purchased')
        item.save()
    data = [dict(i) for i in Item.objects.all().values('id', 'name', 'quantity', 'purchased')]
    return JsonResponse({'items': data})
