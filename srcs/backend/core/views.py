from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes

@api_view(['POST'])
@permission_classes([AllowAny])
def game_state_init(request):
	if request.data.get('state') == 'initial_state':
		game = {
			'LeftPaddle': {
				'name': 'player1',
				'x': '0',
				'y': '0',
				'z': '-10',
				'keys': {
					'left': ['A', 'a'],
					'right': ['D', 'd']
				}
			},
			'RightPaddle': {
				'name': 'player2',
				'x': '0',
				'y': '0',
				'z': '5',
				'keys': {
					'left': ['ArrowLeft'],
					'right': ['ArrowRight']
				}
			},
			'ball': {
				'x': '0',
				'y': '0',
				'z': '0',
				'speed': '5'
			}
		}
	return Response(game, status=201)