from django.http import Http404
from django.shortcuts import render_to_response
from django.template import RequestContext

from roaster.models import Roaster, Cafe

def roaster_details(request, slug=None):
    """
    View the details for a Roaster.
    """
    try:
        context = {
            'roaster': Roaster.objects.get(slug=slug),
        }

        return render_to_response('roaster.html',
                context, context_instance=RequestContext(request))
    except Roaster.DoesNotExist:
        raise Http404

def cafe_details(request, slug=None):
    """
    View the details for a Cafe.
    """
    try:
        context = {
            'cafe': Cafe.objects.get(slug=slug),
        }

        return render_to_response('cafe.html',
                context, context_instance=RequestContext(request))
    except Cafe.DoesNotExist:
        raise Http404
