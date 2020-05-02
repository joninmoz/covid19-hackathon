import pandas as pd
import os
import numpy as np
from math import radians, sin, asin, sqrt, atan2, cos

class InitialLocation:

    def __init__(self, lat, long):
        self.latitude = lat
        self.longitude = long
        self.provider_distance = dict()

    def find_ten_nearest_providers(self):
        self.provider_distance = {k: v for k, v in sorted(self.provider_distance.items(), key=lambda item: item[1])}
        return list(self.provider_distance.keys())[:10], list(self.provider_distance.values())[:10]

class ProviderLocation:
    def __init__(self, osm_id, lat, long):
        self.latitude = lat
        self.longitude = long
        self.osm_id = osm_id

def calculate_manhattan_distance(initial_location: InitialLocation, provider_location: ProviderLocation):
    # convert decimal degrees to radians
    lat1, lon1, lat2, lon2 = map(radians,
                                 [initial_location.latitude, initial_location.longitude, provider_location.latitude,
                                  provider_location.longitude])
    i_hat = [1, 0]
    j_hat = [0, 1]
    a = np.array([[i_hat[0], j_hat[0]], [i_hat[1], j_hat[1]]])
    b = np.array([lon2 - lon1, lat2 - lat1])
    x = (np.linalg.solve(a, b)).tolist()
    mid_point = [i_hat[0] * x[0] + lon1, i_hat[1] * x[0] + lat1]
    return abs(haversine(lon1, lat1, mid_point[0], mid_point[1])) + abs(
        haversine(mid_point[0], mid_point[1], lon2, lat2))


def haversine(lon1, lat1, lon2, lat2):
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * asin(sqrt(a))
    r = 6371
    return c * r

# This is the main function
def generate_list_of_providers(latitude, longitude, boolean_parameters):
    path = os.getcwd()
    providers = pd.read_csv(path + "\\covid_data\\hotosm_nga_health_facilities_points.csv", index_col=False)
    providers = providers[providers['TestingAvailability'] == boolean_parameters['TestingAvailability']] if boolean_parameters['TestingAvailability'] else providers
    providers = providers[providers['BedAvailability'] == boolean_parameters['BedAvailability']] if boolean_parameters['BedAvailability'] else providers
    providers = providers[providers['VentilatorAvailability'] == boolean_parameters['VentilatorAvailability']] if boolean_parameters['VentilatorAvailability'] else providers
    initial_location = InitialLocation(latitude, longitude)
    provider_locations = []
    for index, row in providers.iterrows():
        provider_locations.append(ProviderLocation(row['osm_id'], row['latitude'], row['longitude']))
    for provider in provider_locations:
        initial_location.provider_distance[provider.osm_id] = calculate_manhattan_distance(initial_location, provider)
    final_provider_list = initial_location.find_ten_nearest_providers()
    final_providers = providers[providers['osm_id'].isin(final_provider_list[0])]
    final_providers = final_providers.set_index('osm_id')
    final_providers = final_providers.loc[final_provider_list[0]]
    final_providers['Distance'] = np.array(final_provider_list[1])
    print(final_providers.to_json(orient='index'))
    return final_providers.to_json(orient='index')

if __name__ == "__main__":
    generate_list_of_providers(6.590689, 3.9765358, {'TestingAvailability': True, 'BedAvailability': False, 'VentilatorAvailability': False})

    # path = os.getcwd()
    # df = pd.read_csv(path + "\\covid_data\\hotosm_nga_health_facilities_points.csv", index_col=False)
    # df = df.loc[df['VentilatorAvailability'] == True]
    # df.to_csv(path + "\\covid_data\\hotosm_nga_health_facilities_points_ventilator_available.csv", index=False)

    # path = os.getcwd()
    # df = pd.read_csv(path + "\\covid_data\\hotosm_nga_health_facilities_points.csv", index_col=False)
    # booleans = [True, False]
    # df['TestingAvailability'] = np.random.choice(booleans, len(df))
    # df['BedAvailability'] = np.random.choice(booleans, len(df))
    # df['VentilatorAvailability'] = np.random.choice(booleans, len(df))
    # df.to_csv(path + "\\covid_data\\hotosm_nga_health_facilities_points.csv", index=False)
    # df = df.loc[df['column_name'] == some_value]

