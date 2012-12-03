from django.conf.urls import patterns, include, url
from django.contrib import admin

from pdxroasters.api import RoasterResource, RoastResource, CafeResource

# Enable the admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'pdxroasters.views.home', name='home'),
    # url(r'^pdxroasters/', include('pdxroasters.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Wire up the api
    url(r'^api/', include(CafeResource().urls)),
    url(r'^api/', include(RoasterResource().urls)),
    url(r'^api/', include(RoastResource().urls)),

    # Wire up the admin
    url(r'^admin/', include(admin.site.urls)),
)
