import os
import csv

from django.core.management.base import BaseCommand, CommandError
from geopy import geocoders
from optparse import make_option

from roaster.models import BusinessHours, Roaster, Roast, Cafe

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
            help='Geocode addresses')
    )

    cafe_fields = (
        'roaster',
        'name',
        'address',
        'phone',
        'url',
    )

    roaster_fields = (
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
        num_created = 0
        for row in reader:
            # Skip the first row
            name = row.get('name').strip()
            roaster = row.get('roaster').strip()
            if name and name != 'Cafe' and roaster and roaster != 'Roaster':
                cafe, created = Cafe.objects.get_or_create(name=name)

                if created:
                    self.uprint('Importing new cafe: %s' % name)
                    num_created += 1
                else:
                    self.uprint('Updating cafe: %s' % name)

                if self.geocode:
                    g = geocoders.GoogleV3()

                    try:
                        place, (lat, lng) = g.geocode(row.get('address'))
                        self.uprint('  %s,%s' % (lat, lng))
                        cafe.lat = lat
                        cafe.lng = lng
                    except Exception as e:
                        self.uprint('  Failed to geocode address!')

                cafe.address = row.get('address')
                cafe.phone = row.get('phone')
                cafe.url = row.get('url')
                cafe.save()

                try:
                    # Associate roaster with the cafe
                    Roaster.objects.get(name=roaster).cafes.add(cafe)
                except Roaster.DoesNotExist:
                    self.uprint('Roaster %s does not exist!' % roaster)

        self.uprint('Imported %s new cafes.' % num_created)

    def import_roaster(self, reader):
        num_created = 0
        for row in reader:
            # Skip the first row
            name = row.get('name').strip()
            if name and name != 'Roaster':
                roaster, created = Roaster.objects.get_or_create(
                        name=name)

                if created:
                    self.uprint('Importing new roaster: %s' % name)
                    num_created += 1
                else:
                    self.uprint('Updating roaster: %s' % name)

                if self.geocode:
                    g = geocoders.GoogleV3()

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
                roaster.order_online = row.get('order_online') == 1
                roaster.cafe_on_site = row.get('cafe_on_site') == 1
                roaster.open_to_public = row.get('open_to_public') == 'Yes'
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
                    if self.import_type == 'cafes':
                        reader = csv.DictReader(f, fieldnames=self.cafe_fields)
                        self.import_cafe(reader)
                    else:
                        reader = csv.DictReader(f, fieldnames=self.roaster_fields)
                        self.import_roaster(reader)
            else:
                raise CommandError('The given path is not a valid file!')
        except IndexError:
            raise CommandError('The first argument must be a valid path to a CSV!')

