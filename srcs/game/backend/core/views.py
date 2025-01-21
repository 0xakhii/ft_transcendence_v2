from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse
from core.models import init, update
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponseNotAllowed
import json
import logging

logger = logging.getLogger(__name__)
@csrf_exempt
@api_view(['POST'])
def game_state(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        left_paddle = data.get('leftPaddle')
        right_paddle = data.get('rightPaddle')
        ball = data.get('ball')
        print(right_paddle, '  --------')
        direction = data.get('direction')
        init(left_paddle, right_paddle, ball, direction)
        response = update(left_paddle, right_paddle, ball)
        return JsonResponse(response)
    return JsonResponse({'status': 'error'}, status=400)


@api_view(['POST'])
def PaddleMove(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        direction = data.get('direction')
        right_paddle = data.get('rightPaddle')
        if direction == 'up':
        	right_paddle['dy'] = -5
        	if right_paddle['y'] + right_paddle['dy'] < 0:
        		right_paddle['y'] = 0
        		right_paddle['dy'] = 0
        elif direction == 'down':
        	right_paddle['dy'] = 5
        	if right_paddle['y'] + right_paddle['height'] + right_paddle['dy'] < 0:
        		right_paddle['y'] = 0
        		right_paddle['dy'] = 0
        elif direction == 'stop':
        	right_paddle['dy'] = 0
        return JsonResponse({'status': 'success', 'rightPaddle': right_paddle}, status=200)
    return JsonResponse({'status': 'error'}, status=404)