# Generated by Django 4.2 on 2025-02-18 21:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Ball',
        ),
        migrations.DeleteModel(
            name='Paddle',
        ),
    ]
