from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import Profile,FriendRequest
# from django.contrib.auth import get_user_model

class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['username','email','password','first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username = validated_data['username'],
            email = validated_data['email'],
            password = validated_data['password'],
            first_name = validated_data['first_name'],
            last_name = validated_data['last_name']
        )
        return user

class RegistrationSerializer_42(serializers.ModelSerializer):
    # password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['username','email','first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username = validated_data['username'],
            email = validated_data['email'],
            first_name = validated_data['first_name'],
            last_name = validated_data['last_name']
        )
        user.set_unusable_password()
        # user.save()
        return user

class ProfileDetailSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Profile
        fields = ['user', 'bio', 'username','email', 'first_name', 'last_name', 'avatar', 'created_at']

    def get_avatar(self, obj):
        if obj.avatar:
            return obj.avatar.url
        return obj.avatar_url
    
class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', required=False)
    email = serializers.CharField(source='user.email', required=False)
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    class Meta:
        model = Profile
        fields = ['bio','username', 'email', 'first_name','last_name', 'avatar', 'created_at']
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exclude(pk=self.instance.user.pk).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exclude(pk=self.instance.user.pk).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user = instance.user

        for attr, value in user_data.items():
            setattr(user, attr, value)
        user.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance
    
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Invalid username or password")
        data['user'] = user
        return data

class FriendRequestSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    sender_id = serializers.IntegerField(source='sender.id', read_only=True)
    sender_avatar = serializers.SerializerMethodField()
    
    class Meta:
        model = FriendRequest
        fields = ['id', 'sender_id', 'sender_username', 'sender_avatar','timestamp', 'status']
    def get_sender_avatar(self, obj):
        profile = obj.sender.profile
        if profile.avatar:
            return profile.avatar.url
        return profile.avatar_url
    
class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'avatar']
    def get_avatar(self, obj):
        profile = obj.profile
        if profile.avatar:
            return profile.avatar.url
        return profile.avatar_url