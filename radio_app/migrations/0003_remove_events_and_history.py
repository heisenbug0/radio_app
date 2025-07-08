# Generated migration to remove Event and ListeningHistory models

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('radio_app', '0002_remove_old_models'),
    ]

    operations = [
        # Remove Event model
        migrations.DeleteModel(
            name='Event',
        ),
        
        # Remove ListeningHistory model
        migrations.DeleteModel(
            name='ListeningHistory',
        ),
        
        # Remove listeners_count field from RadioStation since we'll use Radiojar's data
        migrations.RemoveField(
            model_name='radiostation',
            name='listeners_count',
        ),
    ]