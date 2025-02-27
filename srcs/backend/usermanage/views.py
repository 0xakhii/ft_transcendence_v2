# from rest_framework.views import APIView
# from rest_framework.response import Response
# from django.shortcuts import get_object_or_404, redirect
# from django.http import JsonResponse
# from rest_framework import status,generics
# from django.contrib.auth.models import User
# from rest_framework.permissions import IsAuthenticated,AllowAny
# from .models import Profile,FriendRequest
# from rest_framework_simplejwt.tokens import RefreshToken
# from .serializers import RegistrationSerializer, LoginSerializer, ProfileSerializer, UserSerializer, RegistrationSerializer_42, FriendRequestSerializer, ProfileDetailSerializer
# import requests
# import json
# from rest_framework.exceptions import NotFound
# from django.contrib.auth import get_user_model
# User = get_user_model()

# DEFAULT_AVATAR_URL = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"

# class login_42(APIView):
#     permission_classes = [AllowAny]
#     def get(self, request):
#         return redirect("https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-b292b631faa175f40c72f3c46c0648df398518e1cd514dc73a6a8014d4600584&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Foauth%2Fcallback%2F&response_type=code")

# def save_to_json(data, file_path="data.json"):
#     try:
#         with open(file_path, "w") as json_file:
#             json.dump(data, json_file, indent=4)
#         print(f"Data successfully saved to {file_path}")
#     except Exception as e:
#         print(f"An error occurred while saving data to {file_path}: {e}")

# class callback_42(APIView):
#     permission_classes = [AllowAny]
#     def get(self, request):
#         code = request.GET.get('code')
#         token_url = 'https://api.intra.42.fr/oauth/token'
#         data = {
#             'grant_type': 'authorization_code',
#             'client_id': "u-s4t2ud-b292b631faa175f40c72f3c46c0648df398518e1cd514dc73a6a8014d4600584",
#             'client_secret': "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",
#             'code': code,
#             'redirect_uri': "http://localhost:8000/oauth/callback/",
#         }
#         response = requests.post(token_url, data=data)
#         token_info = response.json()
#         print(token_info)
#         access_token = token_info.get('access_token')

#         headers = {
#             'Authorization': f'Bearer {access_token}',
#         }
#         response = requests.get('https://api.intra.42.fr/v2/me', headers=headers)
#         if response.status_code == 200:
#             user_data = response.json()
#             user_data_serialized = {
#             'username': user_data.get('login'),
#             'email': user_data.get('email'),
#             'first_name': user_data.get('first_name', ''),
#             'last_name': user_data.get('last_name', ''),
#             }
#             serializer = RegistrationSerializer_42(data=user_data_serialized)
#             if serializer.is_valid():
#                 print(user_data.get('login'))
#                 avatar_urls = user_data.get("image", {}).get("link") or DEFAULT_AVATAR_URL
#                 print("Extracted avatar:", avatar_urls)    
#                 user = serializer.save()
#                 profile = Profile.objects.get(user=user)
#                 profile.avatar_url = avatar_urls
#                 profile.save()
#                 refresh = RefreshToken.for_user(user)
#                 access_token = str(refresh.access_token)
#             save_to_json(user_data)
#             print("this is the token", access_token)
            
#             user_id = request.query_params.get('user_id')
#             redirect_url = f"http://127.0.0.1:5173/#dashboard?access_token={user_id}"
#             return redirect(redirect_url)
#         else:
#             return redirect("http://127.0.0.1:8000/?error")

#         refresh = RefreshToken.for_user(user)


# class RegistrationView(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request):
#         serializer = RegistrationSerializer(data=request.data)
#         if serializer.is_valid():
#             email = request.data.get('email')
#             if User.objects.filter(email=email).exists():
#                 return Response({"error": "Email already exists"}, status=400)
#             user = serializer.save()
#             profile = Profile.objects.get(user=user)
#             return Response({
#                 "message": "User registered successfully!",
#                 "user": {
#                     "username": user.username,
#                     "email": user.email,
#                     "first_name": user.first_name,
#                     "last_name": user.last_name,
#                 },
#                 "profile": {
#                     "bio": profile.bio,
#                     "email": profile.email,
#                     "first_name": profile.first_name,
#                     "last_name": profile.last_name,
#                     "avatar": profile.avatar.url if profile.avatar else None,
#                     "created_at": profile.created_at,
#                 }
#             }, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class LoginView(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request):
#         serializer = LoginSerializer(data=request.data)
#         if serializer.is_valid():
#             user = serializer.validated_data['user']
#             refresh = RefreshToken.for_user(user)
#             return Response({
#                 "message": "Login successful",
#                 'refresh': str(refresh),
#                 'access': str(refresh.access_token),
#             }, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# class ProfileUpdateView(APIView):
#     permission_classes = [IsAuthenticated]

#     def put(self, request):
#         profile = request.user.profile
#         serializer = ProfileSerializer(profile, data=request.data, partial=True)

#         if serializer.is_valid():
#             serializer.save()
#             return Response({"message": "Profile updated successfully!", "profile": serializer.data}, status=status.HTTP_200_OK)
        
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class SendFriendRequestView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request, receiver_id):
#         sender = request.user
#         receiver = get_object_or_404(User, id=receiver_id)
        
#         if sender == receiver:
#             return Response({"error": "You cannot send a friend request to yourself."}, status=status.HTTP_400_BAD_REQUEST)
        
#         # Check for an existing request regardless of its status
#         if FriendRequest.objects.filter(sender=sender, receiver=receiver, status="pending").exists():
#             return Response({"error": "Friend request already sent."}, status=status.HTTP_400_BAD_REQUEST)
        
#         friend_request = FriendRequest.objects.create(sender=sender, receiver=receiver)
#         return Response({"message": "Friend request sent successfully.", "friend_request_id": friend_request.id}, status=status.HTTP_201_CREATED)
    
# class AcceptFriendRequestView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request, request_id):
#         # Retrieve the friend request that is pending and ensure the logged-in user is the receiver
#         friend_request = get_object_or_404(FriendRequest, id=request_id, receiver=request.user, status="pending")
#         friend_request.status = "accepted"
#         friend_request.save()
#         return Response({"message": "Friend request accepted."}, status=status.HTTP_200_OK)

# class RejectFriendRequestView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request, request_id):
#         friend_request = get_object_or_404(FriendRequest, id=request_id, receiver=request.user, status="pending")
#         friend_request.status = "rejected"
#         friend_request.save()
#         return Response({"message": "Friend request rejected."}, status=status.HTTP_200_OK)

# class PendingFriendRequestsView(generics.ListAPIView):
#     permission_classes = [IsAuthenticated]
#     serializer_class = FriendRequestSerializer

#     def get_queryset(self):
#         return FriendRequest.objects.filter(receiver=self.request.user, status="pending")

# class FriendsListView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user = request.user
        
#         sent_requests = FriendRequest.objects.filter(sender=user, accepted=True)
#         received_requests = FriendRequest.objects.filter(receiver=user, accepted=True)
        
#         friends = []
#         for fr in sent_requests:
#             friends.append(fr.receiver)
#         for fr in received_requests:
#             friends.append(fr.sender)
        
#         friends = list(set(friends))
        
#         serializer = UserSerializer(friends, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)
    
# class FriendListView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user = request.user

#         sent_requests = FriendRequest.objects.filter(sender=user, status="accepted")
#         received_requests = FriendRequest.objects.filter(receiver=user, status="accepted")
        
#         friends = [fr.receiver for fr in sent_requests] + [fr.sender for fr in received_requests]
        
#         friends = list(set(friends))
        
#         serializer = UserSerializer(friends, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)

# # def user_list(request):
# #     print("here2")
# #     users = User.objects.all()
# #     data = [{'id': user.id, 'username': user.username, 'email': user.email} for user in users]
# #     return JsonResponse({'users': data}, status=200)

# class UserListView(generics.ListAPIView):
#     permission_classes = [IsAuthenticated]
#     queryset = User.objects.all()
#     serializer_class = UserSerializer

# # class ProfileDetailView(generics.RetrieveAPIView):
# #     serializer_class = ProfileDetailSerializer
# #     permission_classes = [IsAuthenticated]

# #     def get_object(self):
# #         return self.request.user.profile

# class ProfileDetailView(generics.RetrieveAPIView):
#     serializer_class = ProfileDetailSerializer
#     permission_classes = [IsAuthenticated]
#     queryset = Profile.objects.all()  # Placeholder queryset

#     def get_object(self):
#         try:
#             return self.request.user.profile
#         except Profile.DoesNotExist:
#             raise NotFound("Profile not found for the authenticated user")

# # class ProfileDetailView(generics.RetrieveAPIView):
# #     serializer_class = ProfileDetailSerializer
# #     permission_classes = [AllowAny]

# #     def get_object(self):
# #         request = self.request

# #         user_id = request.query_params.get('user_id')
# #         user = User.objects.get(id=user_id)

# #         return user.profile


from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404, redirect
from django.http import JsonResponse
from rest_framework import status,generics
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated,AllowAny
from .models import Profile,FriendRequest
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegistrationSerializer, LoginSerializer, ProfileSerializer, UserSerializer, RegistrationSerializer_42, FriendRequestSerializer, ProfileDetailSerializer
from rest_framework.parsers import MultiPartParser, FormParser
import requests
import json

from django.contrib.auth import get_user_model
User = get_user_model()

DEFAULT_AVATAR_URL = "/media/avatars/Profile_avatar_placeholder_large.png"

class login_42(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        return redirect("https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-b292b631faa175f40c72f3c46c0648df398518e1cd514dc73a6a8014d4600584&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Foauth%2Fcallback%2F&response_type=code")

def save_to_json(data, file_path="data.json"):
    try:
        with open(file_path, "w") as json_file:
            json.dump(data, json_file, indent=4)
        print(f"Data successfully saved to {file_path}")
    except Exception as e:
        print(f"An error occurred while saving data to {file_path}: {e}")

class callback_42(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        code = request.GET.get('code')
        token_url = 'https://api.intra.42.fr/oauth/token'
        data = {
            'grant_type': 'authorization_code',
            'client_id': "u-s4t2ud-b292b631faa175f40c72f3c46c0648df398518e1cd514dc73a6a8014d4600584",
            'client_secret': "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",
            'code': code,
            'redirect_uri': "http://localhost:8000/oauth/callback/",
        }
        response = requests.post(token_url, data=data)
        token_info = response.json()
        print(token_info)
        access_token = token_info.get('access_token')

        headers = {
            'Authorization': f'Bearer {access_token}',
        }
        response = requests.get('https://api.intra.42.fr/v2/me', headers=headers)
        if response.status_code == 200:
            user_data = response.json()
            user_data_serialized = {
            'username': user_data.get('login'),
            'email': user_data.get('email'),
            'first_name': user_data.get('first_name', ''),
            'last_name': user_data.get('last_name', ''),
            }
            serializer = RegistrationSerializer_42(data=user_data_serialized)
            if serializer.is_valid():
                print(user_data.get('login'))
                avatar_urls = user_data.get("image", {}).get("link") or DEFAULT_AVATAR_URL
                print("Extracted avatar:", avatar_urls)    
                user = serializer.save()
                profile = Profile.objects.get(user=user)
                profile.avatar_url = avatar_urls
                profile.save()
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)
                user_id = user.id
                print("userid", user_id)
            else :
                user = User.objects.get(username=user_data.get('login'))
                user_id = user.id
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)
                print("userid", user_id)
            save_to_json(user_data)
            print("this is the token", access_token)
            redirect_url = redirect_url = f"http://127.0.0.1:5173/#/dashboard?success&access_token={access_token}&user_id={user_id}"
            return redirect(redirect_url)
        else:
            return redirect("http://127.0.0.1:8000/?error")

        refresh = RefreshToken.for_user(user)

class RegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            email = request.data.get('email')
            if User.objects.filter(email=email).exists():
                return Response({"error": "Email already exists"}, status=400)
            user = serializer.save()
            profile = Profile.objects.get(user=user)
            return Response({
                "message": "User registered successfully!",
                "user": {
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                },
                "profile": {
                    "bio": profile.bio,
                    "email": profile.email,
                    "first_name": profile.first_name,
                    "last_name": profile.last_name,
                    "avatar": profile.avatar.url if profile.avatar else None,
                    "created_at": profile.created_at,
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class LoginView(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request):
#         serializer = LoginSerializer(data=request.data)
#         if serializer.is_valid():
#             user = serializer.validated_data['user']
#             refresh = RefreshToken.for_user(user)
#             return Response({
#                 "message": "Login successful",
#                 'refresh': str(refresh),
#                 'access': str(refresh.access_token),
#             }, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Login successful",
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user_id': user.id,  # Add the user's ID to the response
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class ProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser,)

    def put(self, request):
        profile = request.user.profile
        serializer = ProfileSerializer(profile, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Profile updated successfully!", "profile": serializer.data}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SendFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, receiver_id):
        sender = request.user
        receiver = get_object_or_404(User, id=receiver_id)
        
        if sender == receiver:
            return Response({"error": "You cannot send a friend request to yourself."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check for an existing request regardless of its status
        if FriendRequest.objects.filter(sender=sender, receiver=receiver, status="pending").exists():
            return Response({"error": "Friend request already sent."}, status=status.HTTP_400_BAD_REQUEST)
        
        friend_request = FriendRequest.objects.create(sender=sender, receiver=receiver)
        return Response({"message": "Friend request sent successfully.", "friend_request_id": friend_request.id}, status=status.HTTP_201_CREATED)
    
class AcceptFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, request_id):
        # Retrieve the friend request that is pending and ensure the logged-in user is the receiver
        friend_request = get_object_or_404(FriendRequest, id=request_id, receiver=request.user, status="pending")
        friend_request.status = "accepted"
        friend_request.save()
        return Response({"message": "Friend request accepted."}, status=status.HTTP_200_OK)

class RejectFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, request_id):
        friend_request = get_object_or_404(FriendRequest, id=request_id, receiver=request.user, status="pending")
        # friend_request.status = "rejected"
        # friend_request.save()
        friend_request.delete()
        return Response({"message": "Friend request rejected."}, status=status.HTTP_200_OK)

class PendingFriendRequestsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FriendRequestSerializer

    def get_queryset(self):
        return FriendRequest.objects.filter(receiver=self.request.user, status="pending")

# class FriendsListView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user = request.user
        
#         sent_requests = FriendRequest.objects.filter(sender=user, accepted=True)
#         received_requests = FriendRequest.objects.filter(receiver=user, accepted=True)
        
#         friends = []
#         for fr in sent_requests:
#             friends.append(fr.receiver)
#         for fr in received_requests:
#             friends.append(fr.sender)
        
#         friends = list(set(friends))
        
#         serializer = UserSerializer(friends, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)
    
class FriendListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        sent_requests = FriendRequest.objects.filter(sender=user, status="accepted")
        received_requests = FriendRequest.objects.filter(receiver=user, status="accepted")
        
        friends = [fr.receiver for fr in sent_requests] + [fr.sender for fr in received_requests]
        
        friends = list(set(friends))
        
        serializer = UserSerializer(friends, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    def delete(self, request, username=None):
        user = request.user
        friend = User.objects.filter(username=username).first()
        friend_request = FriendRequest.objects.filter(
            status="accepted",
            sender=user,
            receiver=friend
        ).first()
        
        if not friend_request:
            friend_request = FriendRequest.objects.filter(
                status="accepted",
                sender=friend,
                receiver=user
            ).first()
        
        if friend_request:
            friend_request.delete()
            return Response({"message": "Friend removed successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Friend request not found"}, status=status.HTTP_404_NOT_FOUND)

# def user_list(request):
#     print("here2")
#     users = User.objects.all()
#     data = [{'id': user.id, 'username': user.username, 'email': user.email} for user in users]
#     return JsonResponse({'users': data}, status=200)

class UserListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ProfileDetailView(generics.RetrieveAPIView):
    serializer_class = ProfileDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.profile

# class ProfileDetailView(generics.RetrieveAPIView):
#     serializer_class = ProfileDetailSerializer
#     permission_classes = [AllowAny]

#     def get_object(self):
#         request = self.request
        
#         user_id = request.query_params.get('user_id')
#         user = User.objects.get(id=user_id)
        
#         return user.profile
    