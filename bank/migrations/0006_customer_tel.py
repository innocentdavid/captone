# Generated by Django 3.0.6 on 2020-08-08 00:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bank', '0005_history_naration'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='tel',
            field=models.CharField(max_length=200, null=True),
        ),
    ]
