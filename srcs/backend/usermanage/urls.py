from django.urls import path
from .views import login_42, callback_42,RegistrationView, LoginView, ProfileUpdateView, SendFriendRequestView, AcceptFriendRequestView, RejectFriendRequestView, PendingFriendRequestsView,FriendListView,UserListView,ProfileDetailView
from . import views
urlpatterns = [
    path('42_login/', login_42.as_view(), name='login_42'),
    path('oauth/callback/', callback_42.as_view(), name='callback_42'),
    path('register/', RegistrationView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/update/', ProfileUpdateView.as_view(), name='profile-update'),
    path("friends/send/<int:receiver_id>/", SendFriendRequestView.as_view(), name="send-friend-request"),
    path("friends/accept/<int:request_id>/", AcceptFriendRequestView.as_view(), name="accept-friend-request"),
    path("friends/reject/<int:request_id>/", RejectFriendRequestView.as_view(), name="reject-friend-request"),
    path("friends/pending/", PendingFriendRequestsView.as_view(), name="pending-friend-requests"),
    path("friends/list/", FriendListView.as_view(), name="friends-list"),
    # path('users/', views.user_list, name='user_list'),
    path("profile/", ProfileDetailView.as_view(), name="profile-detail"),
    path('users/', UserListView.as_view(),name='userlistview'),
]