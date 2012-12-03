import re

from django.db import models
from django.template.defaultfilters import slugify

def format_phone_number(phone):
    phone = re.sub('[^\w]', '', phone)
    if (len(phone) == 10):
        return '(%s) %s-%s' % (phone[:3], phone[3:6], phone[6:10])
    else:
        return ''

class Cafe(models.Model):
    name = models.CharField(max_length=200, unique=True, db_index=True,
            blank=False)
    slug = models.SlugField()
    address = models.CharField(max_length=200)
    # TODO: Hours
    phone = models.CharField(max_length=10)
    url = models.URLField(max_length=200, verbose_name='URL',)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    modified_at = models.DateTimeField(auto_now=True, db_index=True)
 
    def __unicode__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.pk:
            self.slug = slugify(self.name)

        # Sanitize the phone number
        self.phone = format_phone_number(self.phone)

        super(Cafe, self).save(*args, **kwargs)

    class Meta:
        ordering = ['name',]

class Roaster(models.Model):
    name = models.CharField(max_length=200, unique=True, db_index=True,
            blank=False)
    slug = models.SlugField()
    address = models.TextField()
    # TODO: Hours
    phone = models.CharField(max_length=10)
    url = models.URLField(max_length=200, verbose_name='URL')
    description = models.TextField()
    photo_url = models.URLField(max_length=200, verbose_name='Photo URL')
    video_url = models.URLField(max_length=200, verbose_name='Video URL')
    cafes = models.ManyToManyField('Cafe')
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    modified_at = models.DateTimeField(auto_now=True, db_index=True)

    def __unicode__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.pk:
            self.slug = slugify(self.name)

        # Sanitize the phone number
        self.phone = format_phone_number(self.phone)

        super(Roaster, self).save(*args, **kwargs)

    class Meta:
        ordering = ['name',]
        get_latest_by = 'created_at'

class Roast(models.Model):
    name = models.CharField(max_length=200, unique=True, db_index=True,
            blank=False)
    roaster = models.ForeignKey('Roaster', related_name='roasts')
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    modified_at = models.DateTimeField(auto_now=True, db_index=True)

    def __unicode__(self):
        return self.name

    class Meta:
        ordering = ['name',]

