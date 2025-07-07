from django.apps import AppConfig


class RadioAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'radio_app'
    
    def ready(self):
        import radio_app.signals