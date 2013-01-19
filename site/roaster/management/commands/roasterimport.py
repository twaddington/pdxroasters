import os
import csv

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from geopy import geocoders
from optparse import make_option

from roaster.models import BusinessHours, Roaster, Roast

IMPORT_TYPES = ('roasters', 'cafes',)

class Command(BaseCommand):
    args = "<filename>"
    help = """\
        Imports a list of roasters from a CSV."""

    option_list = BaseCommand.option_list + (
        make_option('--quiet', action='store_true', dest='quiet',
            default=False, help='Suppress all output except errors'),
        make_option('--import-type', choices=IMPORT_TYPES,
            dest='import_type', default='roasters',
            help='One of the following: %s' % (', '.join(IMPORT_TYPES),)),
        make_option('--geocode', action='store_true', dest='geocode',
            help='Geocode store addresses')
    )

    fields = (
        'name',
        'order_online',
        'cafe_on_site',
        'open_to_public',
        'address',
        'mon',
        'tue',
        'wed',
        'thu',
        'fri',
        'sat',
        'sun',
        'phone',
        'url',
        'description',
        'photo_url',
        'video_url',
        'video_embed',
        'roasts',
    )

    def uprint(self, msg):
        """
        Unbuffered print.
        """
        if not self.quiet:
            self.stdout.write("%s\n" % msg)
            self.stdout.flush()

    def import_cafe(self, reader):
        pass

    def import_roaster(self, reader):
        num_created = 0
        for row in reader:
            # Skip the first row
            name = row.get('name').strip()
            if row.get('name') and row.get('name') != 'Name':
                roaster, created = Roaster.objects.get_or_create(
                        name=name)

                if created:
                    self.uprint('Importing new roaster: %s' % name)
                    num_created += 1
                else:
                    self.uprint('Updating roaster: %s' % name)

                if self.geocode:
                    g = geocoders.Google()

                    try:
                        place, (lat, lng) = g.geocode(row.get('address'))
                        self.uprint('  %s,%s' % (lat, lng))
                        roaster.lat = lat
                        roaster.lng = lng
                    except Exception as e:
                        self.uprint('  Failed to geocode address!')

                roaster.address = row.get('address')
                roaster.phone = row.get('phone')
                roaster.description = row.get('description')
                roaster.url = row.get('url').lower()
                roaster.photo_url = row.get('photo_url').lower()
                roaster.video_url = row.get('video_url').lower()
                roaster.active = True
                roaster.save()

                # Remove any existing hours
                BusinessHours.objects.filter(business=roaster).delete()

                # Hours
                hours = [
                    row.get('mon', '').split(','),
                    row.get('tue', '').split(','),
                    row.get('wed', '').split(','),
                    row.get('thu', '').split(','),
                    row.get('fri', '').split(','),
                    row.get('sat', '').split(','),
                    row.get('sun', '').split(','),
                ]

                # Create hours
                for d,h in enumerate(hours):
                    if len(h) is 2:
                        o = h[0]
                        c = h[1]

                        if len(o) < 3:
                            o = '%s:00' % o
                        if len(c) < 3:
                            c = '%s:00' % c

                        # Zulu time
                        tmp = c.split(':')
                        c = '%s:%s' % (int(tmp[0]) + 12, tmp[1])
 
                        BusinessHours.objects.create(weekday=d,
                                open=o, close=c, business=roaster)

                # Create roasts
                roasts = row.get('roasts', '')
                for r in roasts.split(','):
                    roast_name = r.strip()
                    if roast_name:
                        roast, roast_created = Roast.objects.get_or_create(
                                name=roast_name, roaster=roaster)

                        if roast_created:
                            self.uprint('  %s' % roast_name)

        self.uprint('Imported %s new roasters.' % num_created)

    def handle(self, *args, **options):
        self.quiet = options.get('quiet', False)
        self.geocode = options.get('geocode', False)
        self.import_type = options.get('import_type')

        try:
            path = os.path.abspath(args[0])

            if os.path.isfile(path):
                self.uprint('Importing from "%s"' % path)

                with open(path, 'rb') as f:
                    reader = csv.DictReader(f, fieldnames=self.fields)

                    if self.import_type is 'cafes':
                        self.import_cafe(reader)
                    else:
                        self.import_roaster(reader)
            else:
                raise CommandError('The given path is not a valid file!')
        except IndexError:
            raise CommandError('The first argument must be a valid path to a CSV!')

