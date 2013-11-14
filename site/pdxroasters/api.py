from tastypie import fields
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.resources import ModelResource

from roaster.models import Roaster, Roast, Cafe, BusinessHours

class HoursResource(ModelResource):
    class Meta:
        queryset = BusinessHours.objects.all()
        filtering = {
            'slug': ('exact', 'startswith',),
            'name': ALL,
        }
        resource_name = 'hours'
        list_allowed_methods = None
        detail_allowed_methods = None

class CafeResource(ModelResource):
    hours = fields.ToManyField(HoursResource, 'hours', full=True)

    class Meta:
        queryset = Cafe.objects.filter(active=True)
        resource_name = 'cafe'
        list_allowed_methods = ['get',]
        detail_allowed_methods = ['get',]

class RoasterResource(ModelResource):
    roasts = fields.ToManyField('pdxroasters.api.RoastResource',
            'roasts', full=True)
    hours = fields.ToManyField(HoursResource, 'hours', full=True)
    cafes = fields.ToManyField(CafeResource, 'cafes', full=False)

    class Meta:
        queryset = Roaster.objects.filter(active=True)
        filtering = {
            'slug': ('exact', 'startswith',),
            'name': ALL,
        }
        resource_name = 'roaster'
        list_allowed_methods = ['get',]
        detail_allowed_methods = ['get',]

class RoastResource(ModelResource):
    roaster = fields.ToOneField(RoasterResource, 'roaster', full=False)

    class Meta:
        queryset = Roast.objects.filter(active=True)
        filtering = {
            'name': ALL,
        }
        resource_name = 'roast'
        list_allowed_methods = ['get',]
        detail_allowed_methods = ['get',]
