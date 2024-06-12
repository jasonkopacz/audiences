from django.shortcuts import render
from .models import Audience
import pandas as pd
from .reach_efficiency_by_zipcode import get_efficiency_stats, get_reach_efficiency
from django.http import JsonResponse

from rest_framework import viewsets
from .models import Audience
from .serializers import AudienceSerializer
from django.views.decorators.csrf import csrf_exempt

class AudienceViewSet(viewsets.ModelViewSet):
    # print(Audience.objects.all())
    queryset = Audience.objects.all()
    serializer_class = AudienceSerializer
    @csrf_exempt
    # exempt to save time setting up the request
    @staticmethod
    def upload_csv(request):
        if request.method == 'POST':
            csv_file = request.FILES['file']
            df = pd.read_csv(csv_file)
            processed_data = get_efficiency_stats(df)
            # print(processed_data)
            for _, row in processed_data.iterrows():
                print('before creation')
                Audience.objects.create(
                    zipcode=row['ZIPCODE'],
                    zip_total_people=row['ZIP_TOTAL_PEOPLE'],
                    zip_audience_people=row['ZIP_AUDIENCE_PEOPLE'],
                    zip_target_density=row['TARGET_DENSITY'],
                    cumulative_reach=row['CUMULATIVE_AUD_REACH']
                )
            return JsonResponse({'message': 'File uploaded successfully'})
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    def get_reach_efficiency_data(request):
        reach_level = request.GET.get('reach_level', 1.0)
        reach_level = float(reach_level)
        audiences = Audience.objects.all()
        data = [
            {
                'zipcode': audience.zipcode,
                'zip_total_people': audience.zip_total_people,
                'zip_audience_people': audience.zip_audience_people,
                'zip_target_density': audience.zip_target_density,
                'cumulative_reach': audience.cumulative_reach
            }
            for audience in audiences
        ]
        df = pd.DataFrame(data)
        reach_efficiency = get_reach_efficiency(df, reach_level)
        return JsonResponse(reach_efficiency)