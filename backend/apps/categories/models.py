from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='subcategories')
    description = models.TextField(blank=True)
    icon_identifier = models.CharField(max_length=50, default='ShoppingBag', help_text="Lucide icon identifier")
    sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['sort_order', 'name']
        verbose_name_plural = 'Categories'

    def __str__(self):
        if self.parent:
            return f"{self.parent.name} > {self.name}"
        return self.name


class CategoryAttribute(models.Model):
    ATTR_TYPES = [
        ('text', 'Text'),
        ('number', 'Numeric'),
        ('select', 'Single Select'),
        ('boolean', 'Checkbox / Boolean'),
    ]

    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='attributes')
    name = models.CharField(max_length=100)
    attribute_type = models.CharField(max_length=20, choices=ATTR_TYPES, default='text')
    options = models.JSONField(default=list, blank=True, help_text="Allowed choices for select type")
    is_required = models.BooleanField(default=False)
    is_filterable = models.BooleanField(default=True)

    class Meta:
        unique_together = ('category', 'name')

    def __str__(self):
        return f"{self.category.name} - {self.name} ({self.attribute_type})"
