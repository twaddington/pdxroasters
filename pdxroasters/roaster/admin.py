from django.contrib import admin
from roaster.models import Cafe, Roaster, Roast

class CafeAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}
    list_display = ('name', 'address', 'phone', 'show_url', 'created_at', 'modified_at',)
    search_fields = ('name',)

    def show_url(self, obj):
        return '<a href="%s">%s</a>' % (obj.url, obj.url)
    show_url.allow_tags = True
    show_url.admin_order_field = 'url'
    show_url.short_description = 'URL'

class RoasterAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}
    list_display = ('name', 'address', 'phone', 'show_url', 'created_at', 'modified_at',)
    search_fields = ('name',)

    def show_url(self, obj):
        return '<a href="%s">%s</a>' % (obj.url, obj.url)
    show_url.allow_tags = True
    show_url.admin_order_field = 'url'
    show_url.short_description = 'URL'

class RoastAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'modified_at',)
    search_fields = ('name',)

admin.site.register(Cafe, CafeAdmin)
admin.site.register(Roaster, RoasterAdmin)
admin.site.register(Roast, RoastAdmin)
