import re

from django.db import models
from django.template.defaultfilters import slugify

WEEKDAY_CHOICES = (
    (0, 'Monday'),
    (1, 'Tuesday'),
    (2, 'Wednesday'),
    (3, 'Thursday'),
    (4, 'Friday'),
    (5, 'Saturday'),
    (6, 'Sunday'),
)

def format_phone_number(phone):
    phone = re.sub('[^\w]', '', phone)
    if (len(phone) == 10):
        return '(%s) %s-%s' % (phone[:3], phone[3:6], phone[6:10])
    else:
        return ''

class Business(models.Model):
    name = models.CharField(max_length=200, unique=True, db_index=True,)
    slug = models.SlugField()
    active = models.BooleanField()
    address = models.CharField(max_length=200, blank=True,)
    lat = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True,)
    lng = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True,)
    phone = models.CharField(max_length=14, blank=True,)
    url = models.URLField(max_length=200, verbose_name='URL', blank=True,)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    modified_at = models.DateTimeField(auto_now=True, db_index=True)

    class Meta:
        ordering = ['name',]
        get_latest_by = 'created_at'
 
    def __unicode__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.pk:
            self.slug = slugify(self.name)

        # Sanitize the phone number
        self.phone = format_phone_number(self.phone)

        super(Business, self).save(*args, **kwargs)

class BusinessHours(models.Model):
    weekday = models.IntegerField(choices=WEEKDAY_CHOICES, default=0,)
    open = models.TimeField()
    close = models.TimeField()
    business = models.ForeignKey(Business, related_name='hours',)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True,)
    modified_at = models.DateTimeField(auto_now=True, db_index=True,)

    class Meta:
        ordering = ['weekday',]
        verbose_name = 'Hours'
        verbose_name_plural = 'Hours'
        unique_together = (('weekday', 'business'),)

    def __unicode__(self):
        return "{weekday}: {open} to {close}".format(
                weekday=self.get_weekday_display(), open=self.open,
                close=self.close)

class Cafe(Business):
    pass

class Roaster(Business):
    description = models.TextField(blank=True,)
    photo_url = models.URLField(max_length=200, verbose_name='Photo URL',
            blank=True,)
    video_url = models.URLField(max_length=200, verbose_name='Video URL',
            blank=True,)
    cafes = models.ManyToManyField('Cafe', blank=True,)

class Roast(models.Model):
    name = models.CharField(max_length=200, unique=True, db_index=True,)
    roaster = models.ForeignKey('Roaster', related_name='roasts',)
    active = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True, db_index=True,)
    modified_at = models.DateTimeField(auto_now=True, db_index=True,)

    def __unicode__(self):
        return self.name

    class Meta:
        ordering = ['name',]

