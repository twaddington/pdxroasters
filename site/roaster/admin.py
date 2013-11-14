from django import forms
from django.contrib import admin
from django.contrib.admin.widgets import FilteredSelectMultiple
from django.utils.translation import ugettext_lazy as _
from roaster.models import BusinessHours, Cafe, Roaster, Roast

def mark_active(modeladmin, request, queryset):
    queryset.update(active=True)

def mark_inactive(modeladmin, request, queryset):
    queryset.update(active=False)

class BusinessHoursInline(admin.TabularInline):
    model = BusinessHours
    max_num = 7
    extra = 0

class CafeAdminForm(forms.ModelForm):
    roasters = forms.ModelMultipleChoiceField(
        queryset=Roaster.objects.filter(active=True),
        required=False,
        widget=FilteredSelectMultiple(
            verbose_name=_('Roasters'),
            is_stacked=False
        )
    )

    class Meta:
        model = Cafe

    def __init__(self, *args, **kwargs):
        super(CafeAdminForm, self).__init__(*args, **kwargs)

        if self.instance and self.instance.pk:
            self.fields['roasters'].initial = self.instance.roasters.all()

    def save(self, commit=True):
        cafe = super(CafeAdminForm, self).save(commit=False)

        if commit:
            cafe.save()

        if cafe.pk:
            cafe.roasters = self.cleaned_data['roasters']
            self.save_m2m()

        return cafe

class CafeAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}
    list_display = ('name', 'address', 'phone', 'show_url', 'created_at',
            'modified_at', 'active',)
    list_filter = ('active',)
    search_fields = ('name',)
    actions = (mark_active,mark_inactive)

    inlines = [
        BusinessHoursInline,
    ]

    form = CafeAdminForm

    def show_url(self, obj):
        return '<a href="%s">%s</a>' % (obj.url, obj.url)
    show_url.allow_tags = True
    show_url.admin_order_field = 'url'
    show_url.short_description = 'URL'

class RoasterAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}
    filter_horizontal = ('cafes',)
    list_display = ('name', 'address', 'phone', 'show_url', 'created_at',
            'modified_at', 'active',)
    list_filter = ('active',)
    search_fields = ('name',)
    actions = (mark_active,mark_inactive)

    inlines = [
        BusinessHoursInline,
    ]

    def show_url(self, obj):
        return '<a href="%s">%s</a>' % (obj.url, obj.url)
    show_url.allow_tags = True
    show_url.admin_order_field = 'url'
    show_url.short_description = 'URL'

class RoastAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'modified_at', 'active',)
    search_fields = ('name',)
    actions = (mark_active,mark_inactive)

admin.site.register(Cafe, CafeAdmin)
admin.site.register(Roaster, RoasterAdmin)
admin.site.register(Roast, RoastAdmin)
