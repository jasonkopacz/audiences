from django.db import models

class Audience(models.Model):
    zipcode = models.CharField(max_length=10)
    zip_total_people = models.IntegerField()
    zip_audience_people = models.IntegerField()
    zip_target_density = models.FloatField()
    cumulative_reach = models.IntegerField()
    target_density = models.FloatField()
    cumulative_aud_reach = models.IntegerField()
    cumulative_total_reach = models.IntegerField()
    cumulative_pct_reach = models.FloatField()
    cumulative_target_density = models.FloatField()