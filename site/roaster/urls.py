from django.conf.urls import patterns, url

urlpatterns = patterns('roaster.views',
    url(r'^roaster/(?P<slug>[-\w]+)/$', 'roaster_details', name='roaster'),
    url(r'^cafe/(?P<slug>[-\w]+)/$', 'cafe_details', name='cafe'),
)
