from tastypie import fields
from tastypie.resources import ModelResource

from roaster.models import Roaster, Roast, Cafe

class CafeResource(ModelResource):
    class Meta:
        queryset = Cafe.objects.all()
        resource_name = 'cafe'
        list_allowed_methods = ['get',]

class RoasterResource(ModelResource):
    roasts = fields.ToManyField('pdxroasters.api.RoastResource',
            'roasts', full=True)

    class Meta:
        queryset = Roaster.objects.all()
        resource_name = 'roaster'
        list_allowed_methods = ['get',]

class RoastResource(ModelResource):
    roaster = fields.ToOneField(RoasterResource, 'roaster')

    class Meta:
        queryset = Roast.objects.all()
        resource_name = 'roast'
        list_allowed_methods = ['get',]
