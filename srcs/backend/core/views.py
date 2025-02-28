from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
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
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        match = MatchHistory(
            player1_id=data['player1_id'],
            player2_id=data['player2_id'],
            score1=data['score1'],
            score2=data['score2'],
        )
        match.save()
        return JsonResponse({'message': 'Match history saved'}, status=201)