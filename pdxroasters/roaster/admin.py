from django.contrib import admin
from roaster.models import Cafe, Roaster, Roast

class CafeAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}
    list_display = ('name', 'address', 'phone', 'url', 'created_at', 'modified_at',)
    search_fields = ('name',)

class RoasterAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}
    list_display = ('name', 'address', 'phone', 'url', 'created_at', 'modified_at',)
    search_fields = ('name',)

class RoastAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'modified_at',)
    search_fields = ('name',)

admin.site.register(Cafe, CafeAdmin)
admin.site.register(Roaster, RoasterAdmin)
admin.site.register(Roast, RoastAdmin)
