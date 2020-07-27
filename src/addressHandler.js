import { Address, CityStateZip } from "../models";
import parser from "parse-address";
import { parseOrder } from "./constants";

class AddressHandler {
  constructor(mapService) {
    this.mapService = mapService;
    this.verifyAll = this.verifyAll.bind(this);
  }

  async verifyAll(req, res) {
    const addresses = req.body;
    const out = await Promise.all(
      addresses.map((address) => {
        return this.verifyOne(address);
      })
    );
    res.json(out);
  }

  async verifyOne(input) {
    let cityStateZip = await CityStateZip.findOne({
      where: { zip: input.zip_code },
    });
    if (cityStateZip) {
      const address = await Address.findOne({
        where: {
          cityStateZipId: cityStateZip.id,
          formatted: this.formatAddress(input.address_line_one),
        },
      });
      return Promise.resolve(this.formatOutput(address, cityStateZip));
    }
    return this.createEntries(input, cityStateZip);
  }

  async createEntries(input, cityStateZip) {
    const raw = await this.mapService.addressLookup(input);
    const parsedAddress = parser.parseLocation(raw.formatted);
    if (!cityStateZip) {
      cityStateZip = await CityStateZip.create({
        city: parsedAddress.city,
        state: parsedAddress.state,
        zip: parsedAddress.zip,
      });
    }
    const address = create({
      formatted: this.combineParsed(parsedAddress),
      cityStateZipId: cityStateZip.id,
      lat: raw.lat,
      lon: raw.lon,
    });
    return Promise.resolve(formatOutput(address, cityStateZip));
  }

  formatAddress(address) {
    const parsed = parser.parseLocation(address);
    return this.combineParsed(parsed);
  }

  combineParsed(parsed) {
    const parts = [];
    parseOrder.forEach((key) => {
      if (parsed[key]) {
        parts.push(parsed[key]);
      }
    });
    return parts.join(" ");
  }

  formatOutput(address, cityStateZip) {
    return {
      address_line_one: address.formatted,
      city: cityStateZip.city,
      state: cityStateZip.state,
      zip_code: cityStateZip.zip,
      latitude: address.lat,
      longitude: address.lon,
    };
  }
}

export default AddressHandler;
