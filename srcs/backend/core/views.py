from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import MatchHistory
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import NumberTapMatch
from django.contrib.auth.models import User


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
                result=data.get('result', 'pending')
            )
            match.save()

            user_history = MatchHistory.objects.filter(user=request.user).values(
                'player1_username', 'player2_username', 'score1', 'score2', 'result', 'created_at'
            )

            return JsonResponse({
                'message': 'Match history saved',
                'user_history': list(user_history)
            }, status=201)

        except KeyError as e:
            return JsonResponse({'error': f"Missing field: {str(e)}"}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    def get(self, request):
        try:
            user_history = MatchHistory.objects.filter(user=request.user).values(
                'player1_username', 'player2_username', 'score1', 'score2', 'result', 'created_at'
            )

            return JsonResponse({
                'username': request.user.username,
                'match_history': list(user_history)
            }, status=200)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

############################
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import NumberTapMatch
from django.contrib.auth.models import User
from rest_framework import status

class NumberTapMatchHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        matches = NumberTapMatch.objects.filter(player1=user) | NumberTapMatch.objects.filter(player2=user)
        match_data = []
        for match in matches:
            is_player1 = match.player1 == user
            match_data.append({
                'player1_username': match.player1.username,
                'player2_username': match.player2.username,
                'user_score': match.player1_score if is_player1 else match.player2_score,
                'opponent_score': match.player2_score if is_player1 else match.player1_score,
                'created_at': match.created_at.isoformat(),
            })
        
        # Calculate stats
        total_games = len(match_data)
        total_score = sum(match['user_score'] for match in match_data)
        avg_score = round(total_score / total_games, 2) if total_games > 0 else 0
        wins = sum(1 for match in match_data if match['user_score'] > match['opponent_score'])
        losses = sum(1 for match in match_data if match['user_score'] < match['opponent_score'])

        return Response({
            'match_history': match_data,
            'stats': {
                'total_games': total_games,
                'total_score': total_score,
                'average_score': avg_score,
                'wins': wins,
                'losses': losses,
            }
        }, status=status.HTTP_200_OK)