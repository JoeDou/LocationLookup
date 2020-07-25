import { Client } from "@googlemaps/google-maps-services-js";
const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

class MapServices {
  constructor() {
    this.client = this.client || new Client({});
  }

  addressLookup(address) {
    return this.client.geocode({
      params: {
        address,
        key: API_KEY,
      },
      timeout: 1000, // milliseconds
    });
  }
}

module.exports = new MapServices();
