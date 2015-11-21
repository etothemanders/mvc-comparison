from django.http import HttpResponseRedirect, JsonResponse

from models import Item


def items(request):
    if request.method == 'POST':
        data = request.POST
        item = Item(name=data.get('name'), quantity=data.get('quantity'))
        item.add()
        return HttpResponseRedirect('items/')
    data = [dict(item) for item in Item.objects.all().values('id', 'name', 'quantity', 'purchased')]
    return JsonResponse({'items': data})
    