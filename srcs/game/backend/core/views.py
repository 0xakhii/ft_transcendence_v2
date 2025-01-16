from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse
from core.models import init
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponseNotAllowed
import json
import logging

logger = logging.getLogger(__name__)
@csrf_exempt
def game_state(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        left_paddle = data.get('leftPaddle')
        right_paddle = data.get('rightPaddle')
        ball = data.get('ball')
        logger.debug('POST SUCCESS')
        init(left_paddle, right_paddle, ball)
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'}, status=400)
