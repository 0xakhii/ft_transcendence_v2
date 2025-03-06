
# chat/views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from .models import ChatMessage
import json

@csrf_exempt
def get_chat_history(request):
    if request.method == 'GET':
        sender_name = request.GET.get('sender')
        receiver_name = request.GET.get('receiver')
        if not sender_name or not receiver_name:
            return JsonResponse({'error': 'Sender and receiver are required'}, status=400)

        try:
            sender = User.objects.get(username=sender_name)
            receiver = User.objects.get(username=receiver_name)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)

        # Fetch messages between sender and receiver, ordered by timestamp
        messages = ChatMessage.objects.filter(
            (models.Q(sender=sender, receiver=receiver) | models.Q(sender=receiver, receiver=sender))
        ).order_by('timestamp')

        # Serialize messages to match the conversations structure (text, type, time)
        message_list = [{
            'text': msg.message,
            'type': 'sender' if msg.sender.username == sender_name else 'receiver',
            'time': msg.timestamp.isoformat(),
        } for msg in messages]

        return JsonResponse({'messages': message_list}, status=200)

@csrf_exempt
def clear_chat_history(request):
    if request.method == 'POST':
        sender_name = request.POST.get('sender')
        receiver_name = request.POST.get('receiver')
        if not sender_name or not receiver_name:
            return JsonResponse({'error': 'Sender and receiver are required'}, status=400)

        try:
            sender = User.objects.get(username=sender_name)
            receiver = User.objects.get(username=receiver_name)
            ChatMessage.objects.filter(
                (models.Q(sender=sender, receiver=receiver) | models.Q(sender=receiver, receiver=sender))
            ).delete()
            return JsonResponse({'message': 'Chat history cleared successfully'}, status=200)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)

@csrf_exempt
def clear_user_chat_history(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        if not username:
            return JsonResponse({'error': 'Username is required'}, status=400)

        try:
            user = User.objects.get(username=username)
            ChatMessage.objects.filter(
                models.Q(sender=user) | models.Q(receiver=user)
            ).delete()
            return JsonResponse({'message': 'User chat history cleared successfully'}, status=200)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
