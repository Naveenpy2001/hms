# Generated by Django 5.1.6 on 2025-04-15 06:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_patientregister_selectedtest'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='patientregister',
            name='appointment',
        ),
    ]
