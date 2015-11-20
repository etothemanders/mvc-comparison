from django.http import JsonResponse

from models import Item


def items(request):
    data = [dict(item) for item in Item.objects.all().values('id', 'name', 'quantity', 'purchased')]
    return JsonResponse({'items': data})
    