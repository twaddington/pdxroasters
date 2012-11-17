from django.db import models

class Cafe(models.Model):
    slug = models.SlugField()
    name = models.CharField(max_length=200, unique=True, db_index=True,
            blank=False)
    address = models.CharField(max_length=200)
    #hours
    phone = models.CharField(max_length=10)
    url = models.URLField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    modified_at = models.DateTimeField(auto_now=True, db_index=True)
 
    class Meta:
        ordering = ['name',]

class Roaster(models.Model):
    slug = models.SlugField()
    name = models.CharField(max_length=200, unique=True, db_index=True,
            blank=False)
    address = models.CharField(max_length=200)
    # TODO: Hours
    phone = models.CharField(max_length=10)
    url = models.URLField(max_length=200)
    description = models.TextField()
    photo_url = models.URLField(max_length=200)
    video_url = models.URLField(max_length=200)
    cafes = models.ManyToManyField('Cafe')
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    modified_at = models.DateTimeField(auto_now=True, db_index=True)

    class Meta:
        ordering = ['name',]
        get_latest_by = 'created_at'

class Roast(models.Model):
    name = models.CharField(max_length=200, unique=True, db_index=True,
            blank=False)
    roaster = models.ForeignKey('Roaster')
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    modified_at = models.DateTimeField(auto_now=True, db_index=True)
    
    class Meta:
        ordering = ['name',]

