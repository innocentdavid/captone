# Generated by Django 3.0.6 on 2020-08-07 22:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bank', '0004_auto_20200807_2351'),
    ]

    operations = [
        migrations.AddField(
            model_name='history',
            name='naration',
            field=models.TextField(blank=True),
        ),
    ]
