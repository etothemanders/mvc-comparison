from django.contrib import admin

from mvcs.models import Item


class ItemAdmin(admin.ModelAdmin):
    model = Item
    list_display = ('id', 'name', 'quantity', 'purchased')


admin.site.register(Item, ItemAdmin)
