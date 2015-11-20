from django.db import models


class Item(models.Model):
    name = models.CharField(max_length=255)
    quantity = models.PositiveSmallIntegerField(default=0)
    purchased = models.BooleanField(default=False)

    def __str__(self):
        return '{id} {name} {qty} purchased={purchased}'.format(id=self.pk, name=self.name, qty=self.quantity, purchased=self.purchased)
