from rest_framework import serializers
from .models import Audience

class AudienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Audience
        fields = '__all__'

from rest_framework import viewsets
from .models import Audience
from .serializers import AudienceSerializer

class AudienceViewSet(viewsets.ModelViewSet):
    queryset = Audience.objects.all()
    serializer_class = AudienceSerializer