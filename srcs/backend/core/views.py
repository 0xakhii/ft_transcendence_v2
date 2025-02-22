from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes
from django.http import JsonResponse


@api_view(['POST'])
@permission_classes([AllowAny])
def game_state_init(request):
	if request.data.get('state') == 'init':
		print('here')
		game = {
			'LeftPaddle': {
				'name': 'player1',
				'x': '0',
				'y': '0',
				'z': '-10',
				'keys': {
					'up': ['W', 'w'],
					'down': ['S', 's']
				}
			},
			'RightPaddle': {
				'name': 'player2',
				'x': '0',
				'y': '0',
				'z': '5',
				'keys': {
					'up': ['ArrowUp'],
					'down': ['ArrowDown']
				}
			},
			'ball': {
				'x': '0',
				'y': '0',
				'z': '10',
				'speed': '5'
			}
		}
		return JsonResponse(game, status=201)
	else:
		return JsonResponse({'error': 'Invalid request'}, status=400)