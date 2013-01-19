from django.shortcuts import render_to_response
from django.template import RequestContext

from roaster.models import Roaster

def home(request):
    """
    """
    context = {
        'roasters': Roaster.objects.all(),
    }

    return render_to_response('home.html',
            context, context_instance=RequestContext(request))
