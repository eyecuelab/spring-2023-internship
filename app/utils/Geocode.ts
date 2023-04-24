import MapboxClient from '@mapbox/mapbox-sdk/services/geocoding';
import type { GeocodeRequest } from '@mapbox/mapbox-sdk/services/geocoding';

const accessToken = process.env.REACT_APP_MAPBOX_TOKEN ?? 'default_access_token';

const mapboxClient = MapboxClient({ accessToken });

const geocodeRequest: GeocodeRequest = {
  query: '1600 Pennsylvania Ave NW, Washington, DC 20500',
  limit: 1,
};

// const geocodeService = GeocodeService(mapboxClient);

mapboxClient.forwardGeocode(geocodeRequest)
  .send()
  .then(response => {
    const coordinates = response.body.features[0].center;
    console.log(`Latitude: ${coordinates[1]}, Longitude: ${coordinates[0]}`);
  })
  .catch(error => {
    console.error(error);
  });
