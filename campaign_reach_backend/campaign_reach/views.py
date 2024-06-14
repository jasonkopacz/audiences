from django.shortcuts import render
from .models import Audience
import pandas as pd
from .reach_efficiency_by_zipcode import get_efficiency_stats, get_reach_efficiency
from .get_reach_efficiency_data import get_reach_efficiency_data
from django.http import JsonResponse

from rest_framework import viewsets
from .models import Audience
from .serializers import AudienceSerializer
from django.views.decorators.csrf import csrf_exempt
import numpy as np

class AudienceViewSet(viewsets.ModelViewSet):
    queryset = Audience.objects.all()
    serializer_class = AudienceSerializer
    @csrf_exempt
    # exempt to save time setting up the request
    @staticmethod
    def upload_csv(request):
        if request.method == 'POST':
            csv_file = request.FILES['file']
            reach_value = float(request.POST.get('reach', 0.5))
            
            raw_df = pd.read_csv(csv_file, dtype={'ZIPCODE': str}, index_col=False)            
            processed_df = get_efficiency_stats(raw_df)
            efficiency_data = processed_df.to_dict(orient='records')
            
            reach_data = get_reach_efficiency_data(processed_df, reach_value)

            response_data = {
            'message': 'File uploaded successfully',
            'data': {'reach_data': reach_data, 'efficiency_data': efficiency_data}
        }
            return JsonResponse(response_data)
        return JsonResponse({'error': 'Method not allowed'}, status=405)

# Next Step: Create Audience Model to save and cache file upload data
       # for _, row in efficiency_stats.iterrows():
            #     Audience.objects.create(
            #         zipcode=row['ZIPCODE'],
            #         zip_total_people=row['ZIP_TOTAL_PEOPLE'],
            #         zip_audience_people=row['ZIP_AUDIENCE_PEOPLE'],
            #         zip_target_density=row['ZIP_TARGET_DENSITY'],
            #         cumulative_reach=row['CUMULATIVE_REACH'],
            #         target_density=row['TARGET_DENSITY'],
            #         cumulative_aud_reach=row['CUMULATIVE_AUD_REACH'],
            #         cumulative_total_reach=row['CUMULATIVE_TOTAL_REACH'],
            #         cumulative_pct_reach=row['CUMULATIVE_PCT_REACH'],
            #         cumulative_target_density=row['CUMULATIVE_TARGET_DENSITY']
            #     )
            # return JsonResponse({'message': 'File uploaded successfully', 'data': efficiency_stats.to_dict(orient='records')})