import os
import csv

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from roaster.models import Roaster, Roast

class Command(BaseCommand):
    help = """\
        Imports a list of roasters from a CSV."""

    fields = (
        'name',
        'address',
        'hours1',
        'hours2',
        'hours3',
        'phone',
        'description',
        'url',
        'photo_url',
        'video_url',
        'roasts',
    )

    def uprint(self, msg):
        """
        Unbuffered print.
        """
        if not self.quiet:
            self.stdout.write("%s\n" % msg)
            self.stdout.flush()

    def handle(self, *args, **options):
        self.quiet = False

        try:
            path = os.path.abspath(args[0])

            if os.path.isfile(path):
                self.uprint('Importing from "%s"' % path)

                num_created = 0
                with open(path, 'rb') as f:
                    reader = csv.DictReader(f, fieldnames=self.fields)
                    for row in reader:
                        # Skip the first row
                        name = row.get('name')
                        if row.get('name') != 'Name':
                            roaster, created = Roaster.objects.get_or_create(
                                    name=name)

                            if created:
                                self.uprint('Importing new roaster: %s' % name)
                                num_created += 1
                            else:
                                self.uprint('Updating roaster: %s' % name)

                            # TODO: Handle hours!
                            roaster.address = row.get('address')
                            roaster.phone = row.get('phone')
                            roaster.description = row.get('description')
                            roaster.url = row.get('url').lower()
                            roaster.photo_url = row.get('photo_url').lower()
                            roaster.video_url = row.get('video_url').lower()
                            roaster.save()

                            # Create roasts
                            roasts = row.get('roasts').split(',')
                            for r in roasts:
                                roast_name = r.strip()
                                if roast_name:
                                    roast, roast_created = Roast.objects.get_or_create(
                                            name=roast_name, roaster=roaster)

                                    if roast_created:
                                        self.uprint('  %s' % roast_name)

                self.uprint('Imported %s new roasters.' % num_created)
            else:
                raise CommandError('The given path is not a valid file!')
        except IndexError:
            raise CommandError('The first argument must be a valid path to a CSV!')

