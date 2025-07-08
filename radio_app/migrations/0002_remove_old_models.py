# Generated migration to clean up old models

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('radio_app', '0001_initial'),
    ]

    operations = [
        # Remove old models that are no longer needed
        migrations.DeleteModel(
            name='Category',
        ),
        migrations.DeleteModel(
            name='BlogPost',
        ),
        migrations.DeleteModel(
            name='Contact',
        ),
        
        # Remove category field from RadioStation
        migrations.RemoveField(
            model_name='radiostation',
            name='category',
        ),
        
        # Remove favorite_stations field from UserProfile
        migrations.RemoveField(
            model_name='userprofile',
            name='favorite_stations',
        ),
    ]