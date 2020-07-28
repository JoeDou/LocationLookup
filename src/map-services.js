import { Client } from "@googlemaps/google-maps-services-js";
import parser from "parse-address";
import { combineStreetComponent, ErrorHandler } from "./utils";

// Google API KEY
const API_KEY = process.env.GOOGLE_MAPS_API_KEY || "api_key";

export default class MapServices {
  constructor(client) {
    this.client = client || new Client({});
  }

  // only public API to lookup an address
  addressLookup(addressObj) {
    return this._request(addressObj.address);
  }

  // formulate request logic for google maps geocode api
  async _request(address) {
    try {
      const geocodeData = await this.client.geocode({
        params: {
          address: address,
          key: API_KEY,
        },
        timeout: 1000, // milliseconds
      });
      return Promise.resolve(this._googleMapper(geocodeData));
    } catch (e) {
      throw new ErrorHandler(503, "Map Service Unavailable");
    }
  }

  // - map google output to an internal format
  // - parser from parse-address lib is used to normalize all address data
  _googleMapper(geocodeData) {
    const parsedData = parser.parseLocation(
      geocodeData.data.results[0].formatted_address.toLowerCase()
    );
    return {
      street: combineStreetComponent(parsedData),
      lat: geocodeData.data.results[0].geometry.location.lat,
      lon: geocodeData.data.results[0].geometry.location.lng,
      city: parsedData.city,
      state: parsedData.state,
      zip_code: parsedData.zip,
    };
  }
}
