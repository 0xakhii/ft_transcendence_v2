# from django.db import models

# Create your models here.
# import random

    # if (Math.random() < 0.5){
    #     ball.dx = 2.5;
    #     ball.dy = 2.5;
    # }
    # else{
    #     ball.dx = -2.5;
    #     ball.dy = -2.5;
    # }
import random
def init(left_paddle, right_paddle, ball):
	if (random.random() < 0.5):
		ball['dx'] = 2.5
		ball['dy'] = 2.5
	else:
		ball['dx'] = -2.5
		ball['dy'] = -2.5
	print("init")
