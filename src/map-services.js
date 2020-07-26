import { Client } from "@googlemaps/google-maps-services-js";
const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

class MapServices {
  constructor() {
    this.client = this.client || new Client({});
  }

  async request(address) {
    try {
      const data = await this.client.geocode({
        params: {
          address,
          key: API_KEY,
        },
        timeout: 1000, // milliseconds
      });
    } catch (e) {
      // TODO: error Handling
      console.log(e);
    }
    return Promise.resolve(data.data.results[0]);
  }
}

module.exports = new MapServices();
