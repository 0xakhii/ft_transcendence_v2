from django.urls import path, re_path
from chat import views, consumers

websocket_urlpatterns = [
    re_path(r"ws/chat/(?P<sender>[^/]+)/(?P<receiver>[^/]+)/$", consumers.ChatConsumer.as_asgi()),
]

urlpatterns = [
    path('chat/history/', views.get_chat_history, name='chat_history'),
    path('chat/clear/', views.clear_chat_history, name='clear_chat_history'),
    path('chat/clear_user/', views.clear_user_chat_history, name='clear_user_chat_history'),
    # ... other URL patterns if any ...
]