from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import MatchHistory
from rest_framework import status

class GameInitView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        if data.get('state') == 'init':
            return JsonResponse({
                'LeftPaddle': {'x': -8, 'y': 0, 'z': 15},
                'RightPaddle': {'x': 8, 'y': 0, 'z': -15},
                'ball': {'x': 0, 'y': 0, 'z': 0},
            })
        return JsonResponse({'error': 'Invalid state'}, status=400)


class MatchHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        
        try:
            match = MatchHistory(
                user=request.user,
                player1_username=data['player1_username'],
                player2_username=data['player2_username'],
                score1=data['score1'],
                score2=data['score2'],
            )
            match.save()

            user_history = MatchHistory.objects.filter(user=request.user).values(
                'player1_username', 'player2_username', 'score1', 'score2', 'created_at'
            )

            return JsonResponse({
                'message': 'Local match history saved',
                'user_history': list(user_history)
            }, status=201)

        except KeyError as e:
            return JsonResponse({'error': f"Missing field: {str(e)}"}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    def get(self, request):
        try:
            user_history = MatchHistory.objects.filter(user=request.user).values(
                'player1_username', 'player2_username', 'score1', 'score2', 'created_at'
            )

            return JsonResponse({
                'username': request.user.username,
                'match_history': list(user_history)
            }, status=200)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)