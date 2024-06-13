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
    queryset = Audience.objects.all()
    serializer_class = AudienceSerializer
    @csrf_exempt
    # exempt to save time setting up the request
    @staticmethod
    def upload_csv(request):
        if request.method == 'POST':
            csv_file = request.FILES['file']
            df = pd.read_csv(csv_file, dtype={'ZIPCODE': str})
            efficiency_stats = get_efficiency_stats(df)

            for _, row in efficiency_stats.iterrows():
                Audience.objects.create(
                    zipcode=row['ZIPCODE'],
                    zip_total_people=row['ZIP_TOTAL_PEOPLE'],
                    zip_audience_people=row['ZIP_AUDIENCE_PEOPLE'],
                    zip_target_density=row['ZIP_TARGET_DENSITY'],
                    cumulative_reach=row['CUMULATIVE_REACH'],
                    target_density=row['TARGET_DENSITY'],
                    cumulative_aud_reach=row['CUMULATIVE_AUD_REACH'],
                    cumulative_total_reach=row['CUMULATIVE_TOTAL_REACH'],
                    cumulative_pct_reach=row['CUMULATIVE_PCT_REACH'],
                    cumulative_target_density=row['CUMULATIVE_TARGET_DENSITY']
                )
            return JsonResponse({'message': 'File uploaded successfully', 'data': efficiency_stats.to_dict(orient='records')})
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    def get_reach_efficiency_data(request):
        reach_level = request.GET.get('reach_level', 0.5)
        reach_level = float(reach_level)
        audiences = Audience.objects.all()
        data = [
            {
                'ZIPCODE': audience.zipcode,
                'ZIP_TOTAL_PEOPLE': audience.zip_total_people,
                'ZIP_AUDIENCE_PEOPLE': audience.zip_audience_people,
                'ZIP_TARGET_DENSITY': audience.zip_target_density,
                'CUMULATIVE_REACH': audience.cumulative_reach,
                'TARGET_DENSITY': audience.target_density,
                'CUMULATIVE_AUD_REACH': audience.cumulative_aud_reach,
                'CUMULATIVE_TOTAL_REACH': audience.cumulative_total_reach,
                'CUMULATIVE_PCT_REACH': audience.cumulative_pct_reach,
                'CUMULATIVE_TARGET_DENSITY': audience.cumulative_target_density
            }
            for audience in audiences
        ]
        df = pd.DataFrame(data)
        reach_efficiency = get_reach_efficiency(df, reach_level)
        print(reach_efficiency)
        reach_efficiency['zipcode_number'] = int(reach_efficiency['zipcode_number'])
        reach_efficiency['audience_reach'] = int(reach_efficiency['audience_reach'])
        reach_efficiency['total_reach'] = int(reach_efficiency['total_reach'])
        
        return JsonResponse(reach_efficiency)
    # {'zipcode_number': 9299, 
    # 'audience_reach': 547173, 
    # 'total_reach': 16137474, 
    # 'pct_reach': 0.49965629891023244, 
    # 'target_density': 0.013828124525560816}