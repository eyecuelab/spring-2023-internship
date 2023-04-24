import MapboxClient from "@mapbox/mapbox-sdk/services/geocoding";
import type { GeocodeRequest } from "@mapbox/mapbox-sdk/services/geocoding";

export async function GetCoordinates(address: string) {
  const accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
  if (!accessToken) {
    throw new Response("Uh Oh! No token found.", { status: 404 });
  }

  const geocodeRequest: GeocodeRequest = {
    query: address,
    limit: 1,
  };

  const mapboxClient = MapboxClient({ accessToken });
  return mapboxClient
    .forwardGeocode(geocodeRequest)
    .send()
    .then((response) => {
      const coordinates = response.body.features[0].center;
      return coordinates;
    })
    .catch((error) => {
      console.error(error);
    });
}

// GetCoordinates("1600 Pennsylvania Ave NW, Washington, DC 20500")
//   .then((coordinates) => {
//     console.log(coordinates);
//   })
//   .catch((error) => {
//     console.error(error);
//   });
