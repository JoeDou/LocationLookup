import { Client } from "@googlemaps/google-maps-services-js";
import { addressOrder } from "./constants";
const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

class MapServices {
  constructor() {
    this.client = this.client || new Client({});
  }

  addressLookup(addressObj) {
    const serializedAddress = this.serialize(addressObj);
    return this.request(serializedAddress);
  }

  async request(address) {
    try {
      const data = await this.client.geocode({
        params: {
          address: address,
          key: API_KEY,
        },
        timeout: 1000, // milliseconds
      });
    } catch (e) {
      // TODO: error Handling
      console.log(e);
    }
    return Promise.resolve({
      formatted: data.data.results[0].formatted_address,
      lat: data.data.results[0].geometry.location.lat,
      lon: data.data.results[0].geometry.location.lng,
    });
  }

  serialize(address) {
    const list = [];
    addressOrder.forEach((key) => {
      output.push(address[key]);
    });
    return list.join(", ");
  }
}

module.exports = new MapServices();
