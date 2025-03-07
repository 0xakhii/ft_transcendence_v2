import logging

logger = logging.getLogger(__name__)

class UpdateLastActivityMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if request.user.is_authenticated:
            profile = request.user.profile
            old_last_activity = profile.last_activity
            profile.update_activity()
        return response