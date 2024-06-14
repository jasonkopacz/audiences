import pandas as pd
from .reach_efficiency_by_zipcode import get_reach_efficiency

def get_reach_efficiency_data(data, reach):
  df = pd.DataFrame(data)
  reach_efficiency_data = []
  if not df.empty:
      for _, row in df.iterrows():
          reach_efficiency = get_reach_efficiency(row.to_frame().T, reach)
          if 'zipcode_number' in reach_efficiency and 'audience_reach' in reach_efficiency and 'total_reach' in reach_efficiency:
              if not row.empty and not pd.isnull(reach_efficiency['audience_reach']):
                  reach_efficiency['zipcode_number'] = reach_efficiency['zipcode_number'].values[0]
                  reach_efficiency['audience_reach'] = int(reach_efficiency['audience_reach'])
                  reach_efficiency['total_reach'] = int(reach_efficiency['total_reach'])
                  reach_efficiency_data.append(reach_efficiency)
  return reach_efficiency_data