from django.db import models

class SiteSetting(models.Model):
    key = models.CharField(max_length=60, unique=True)
    value = models.TextField()
    description = models.CharField(max_length=200, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.key}: {self.value}"
