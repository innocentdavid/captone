# Generated by Django 3.0.6 on 2020-08-18 21:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bank', '0016_accountsummary'),
    ]

    operations = [
        migrations.AlterField(
            model_name='accountsummary',
            name='summary',
            field=models.CharField(default='Account Summary', max_length=200),
        ),
    ]
