from django.conf import settings
from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.views.generic.simple import direct_to_template

from pdxroasters.api import RoasterResource, RoastResource, CafeResource

# Enable the admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'pdxroasters.views.home', name='home'),
    url(r'^contact/$', 'pdxroasters.views.contact', name='contact'),
    url(r'^add-roaster/$', 'pdxroasters.views.add_roaster', name='add-roaster'),

    # Import our roaster paths
    url(r'^', include('roaster.urls')),

    # Wire up the api
    url(r'^api/', include(CafeResource().urls)),
    url(r'^api/', include(RoasterResource().urls)),
    url(r'^api/', include(RoastResource().urls)),

    # Wire up the admin
    url(r'^admin/', include(admin.site.urls)),

    # humans.txt
    (r'^humans\.txt$', direct_to_template,
        {'template': 'humans.txt', 'mimetype': 'text/plain'}),

    # robots.txt
    (r'^robots\.txt$', direct_to_template,
        {'template': 'robots.txt', 'mimetype': 'text/plain'}),

    # crossdomain.xml
    (r'^crossdomain\.xml$', direct_to_template,
        {'template': 'crossdomain.xml', 'mimetype': 'application/xml'}),

    # BingSiteAuth.xml
    (r'BingSiteAuth\.xml$', direct_to_template,
        {'template': 'BingSiteAuth.xml', 'mimetype': 'application/xml'}),
)

# Static files
if settings.DEBUG:
    urlpatterns += staticfiles_urlpatterns()
else:
    urlpatterns += patterns('',
        (r'^static/(.*)$', 'django.views.static.serve',
            {'document_root': settings.STATIC_ROOT}),
    )
