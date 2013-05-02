import json

from django.conf import settings
from django.core import urlresolvers
from django.core.mail import EmailMessage, BadHeaderError
from django.db import IntegrityError
from django.http import HttpResponse, Http404
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.utils.html import strip_tags

from geopy import geocoders
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
        'roasters': Roaster.objects.filter(active=True),
    }

    return render_to_response('home.html',
            context, context_instance=RequestContext(request))

def add_roaster(request):
    """
    Add a new roaster.
    """
    if request.is_ajax():
        if request.method == 'POST':
            # TODO: hours, cafes, roasts
            name = strip_tags(request.POST.get('name')).strip()
            address = strip_tags(request.POST.get('address')).strip()
            phone = strip_tags(request.POST.get('phone')).strip()
            url = strip_tags(request.POST.get('url')).strip()
            description = strip_tags(request.POST.get('description')).strip()

            # booleans
            online_only = request.POST.get('online_only') is not None
            order_online = request.POST.get('order_online') is not None
            cafe_on_site = request.POST.get('cafe_on_site') is not None
            open_to_public = request.POST.get('open_to_public') is not None

            # Return a list of errors
            errors = []

            # TODO: Create an actual form class to handle this validation
            if len(name) == 0:
                errors.append({'error': 'The roaster name cannot be blank','field':'name'})

            if len(address) == 0:
                errors.append({'error': 'The roaster address cannot be blank','field':'address'})

            if len(phone) == 0:
                errors.append({'error': 'The roaster phone cannot be blank','field':'phone'})

            if len(url) == 0:
                errors.append({'error': 'The roaster url cannot be blank','field':'url'})

            if len(description) == 0:
                errors.append({'error': 'The roaster description cannot be blank','field':'description'})

            try:
                roaster = Roaster.objects.get(name__iexact=name)

                # Roaster already exists!
                errors.append({'error': 'The given roaster already exists','field':'name'})
            except Roaster.MultipleObjectsReturned:
                errors.append({'error': 'The given roaster already exists','field':'name'})
            except Roaster.DoesNotExist:
                pass

            if len(errors) == 0:
                roaster = Roaster()
                roaster.name = name
                roaster.address = address
                roaster.phone = phone
                roaster.url = url
                roaster.description = description
                roaster.online_only = online_only
                roaster.order_online = order_online
                roaster.cafe_on_site = cafe_on_site
                roaster.open_to_public = open_to_public
                roaster.active = False

                try:
                    place, (lat, lng) = geocoders.GoogleV3().geocode(address)
                    roaster.lat = lat
                    roaster.lng = lng
                except Exception as e:
                    pass

                # Add the new roaster
                roaster.save()

                # Send a notification email
                subject = 'New Roaster - %s' % name
                message = request.build_absolute_uri(
                        urlresolvers.reverse('admin:roaster_roaster_change', args=(roaster.pk,)))
                EmailMessage(subject, message, settings.DEFAULT_FROM_EMAIL,
                        [settings.DEFAULT_CONTACT_EMAIL]).send()

                return HttpResponse(status=204)
            else:
                return HttpResponse(json.dumps(errors), mimetype=CONTENT_TYPE_JSON)

    raise Http404()

def contact(request):
    """
    Send a simple contact email.
    """
    if request.is_ajax():
        if request.method == 'POST':
            name = request.POST.get('name').strip()
            email = request.POST.get('email').strip()
            message = request.POST.get('message')

            if len(name) == 0:
                return HttpResponse(json.dumps({'error':
                    'Your name cannot be blank','field':'name'}), mimetype=CONTENT_TYPE_JSON)

            if len(email) == 0:
                return HttpResponse(json.dumps({'error':
                    'Your email must be valid','field':'email'}), mimetype=CONTENT_TYPE_JSON)

            if len(message) == 0:
                return HttpResponse(json.dumps({'error':
                    'Your message cannot be blank','field':'message'}), mimetype=CONTENT_TYPE_JSON)

            try:
                # Format the subject
                subject = 'PDX Roasters - %s' % name

                # Format the message
                message = 'Sent from: {name} <{email}>\n\n{message}'.format(\
                        name=name, email=email, message=message)

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

                return HttpResponse(status=204)
            except BadHeaderError:
                return HttpResponse(json.dumps({'error': 'Invalid name or email!'}),
                        mimetype=CONTENT_TYPE_JSON)

    raise Http404()
