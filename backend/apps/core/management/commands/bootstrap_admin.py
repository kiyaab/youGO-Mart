import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.profiles.models import UserProfile

User = get_user_model()

class Command(BaseCommand):
    help = "Securely bootstrap or update the initial platform administrator from environment variables or CLI flags."

    def add_arguments(self, parser):
        parser.add_argument('--email', type=str, help="Administrator email address")
        parser.add_argument('--password', type=str, help="Administrator password")
        parser.add_argument('--username', type=str, default="admin", help="Administrator username")

    def handle(self, *args, **options):
        email = options.get('email') or os.environ.get('YOUGO_ADMIN_EMAIL') or os.environ.get('ADMIN_EMAIL')
        password = options.get('password') or os.environ.get('YOUGO_ADMIN_PASSWORD') or os.environ.get('ADMIN_PASSWORD')
        username = options.get('username') or 'admin'

        if not email or not password:
            self.stderr.write(self.style.ERROR(
                "Error: Administrator email and password must be provided via --email and --password, "
                "or via YOUGO_ADMIN_EMAIL and YOUGO_ADMIN_PASSWORD environment variables."
            ))
            return

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': username,
                'role': 'admin',
                'is_staff': True,
                'is_superuser': True,
                'is_verified': True,
            }
        )

        user.role = 'admin'
        user.is_staff = True
        user.is_superuser = True
        user.is_verified = True
        user.set_password(password)
        user.save()

        UserProfile.objects.update_or_create(
            user=user,
            defaults={
                'display_name': 'Platform Administrator',
                'city': 'Addis Ababa',
                'region': 'Addis Ababa'
            }
        )

        action = "created" if created else "updated"
        self.stdout.write(self.style.SUCCESS(
            f"Successfully {action} verified administrator account for: {email}"
        ))
