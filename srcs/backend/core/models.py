# from django.db import models

# Create your models here.
import random
import json
from django.http import JsonResponse
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes

@permission_classes([AllowAny])
def update(left_paddle, right_paddle, ball):
	left_paddle['y'] += left_paddle['dy']
	right_paddle['y'] += right_paddle['dy']
	ball['x'] += ball['dx']
	ball['y'] += ball['dy']
	response = {
		'ball': ball,
		'right_paddle': right_paddle,
		'left_paddle': left_paddle,
	}
	return response

@permission_classes([AllowAny])
def BallMove(ball):
	if ball['dx'] == 0 and ball['dy'] == 0:
		if (random.random() < 0.5):
			ball['dx'] = 2.5
			ball['dy'] = 2.5
		else:
			ball['dx'] = -2.5
			ball['dy'] = -2.5

@permission_classes([AllowAny])
def init(left_paddle, right_paddle, ball, direction):
	BallMove(ball)
	update(left_paddle, right_paddle, ball)
	print("init")
