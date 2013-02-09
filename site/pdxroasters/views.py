import json

from django.conf import settings
from django.core.mail import EmailMessage, BadHeaderError
from django.http import HttpResponse, Http404
from django.shortcuts import render_to_response
from django.template import RequestContext

from roaster.models import Roaster

CONTENT_TYPE_JSON = 'application/json'

# TODO: Load these from a template somewhere.
CONFIRMATION_EMAIL_SUBJECT = 'PDX Roasters - Thank You!'
CONFIRMATION_EMAIL_BODY = """\
Thank you!

We've received your message and will follow-up
as soon as possible.

--
PDX Roasters
www.pdxroasters.com"""

def home(request):
    """
    Display the home page.
    """
    context = {
        'roasters': Roaster.objects.all(),
    }

    return render_to_response('home.html',
            context, context_instance=RequestContext(request))

def contact(request):
    """
    Send a simple contact email.
    """
    if request.is_ajax():
        if request.method == 'POST':
            data = json.loads(request.raw_post_data)

            # Get our Ajax content
            name = data.get('name').strip()
            email = data.get('email').strip()
            message = data.get('message')

            try:
                # Format the subject
                subject = 'PDX Roasters - %s' % name

                # The email of the sender
                from_email = settings.DEFAULT_FROM_EMAIL

                # The reply-to address
                headers = {
                    'Reply-To': '{name} <{email}>'.format(name=name, email=email),
                }

                # Send the contact message
                EmailMessage(subject, message, from_email,
                        [settings.DEFAULT_CONTACT_EMAIL], headers=headers).send()

                # Send a confirmation to the user
                EmailMessage(CONFIRMATION_EMAIL_SUBJECT,
                        CONFIRMATION_EMAIL_BODY, from_email, [email]).send()

                return HttpResponse()
            except BadHeaderError:
                return HttpResponse(json.dumps({'error': 'Invalid name or email!'}),
                        mimetype=CONTENT_TYPE_JSON)

    raise Http404()
