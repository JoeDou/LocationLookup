import parser from "parse-address";
import { Address, CityStateZip } from "../models";
import {
  combineStreetComponent,
  combineAddressComponent,
  isMatch,
  ErrorHandler,
} from "./utils";

export default class AddressHandler {
  constructor(mapService) {
    this.mapService = mapService;
    this.verifyAndCreateAll = this.verifyAndCreateAll.bind(this);
  }

  async verifyAndCreateAll(req, res, next) {
    const addresses = req.body;
    const output = await Promise.all(
      addresses.map((address) => {
        return this._verifyAndCreateOne(this._serializeInput(address));
      })
    ).catch((e) => {
      if (e instanceof ErrorHandler) {
        next(e);
      } else {
        throw new ErrorHandler(500, "Internal Server Error");
      }
    });
    res.json(output);
  }

  async _verifyAndCreateOne(input) {
    let output = await this._dbVerification(input);
    if (!output) {
      output = await this._mapSericeVerifyAndCreate(input);
    }
    return Promise.resolve(output);
  }

  async _dbVerification(input) {
    try {
      const cityStateZip = await CityStateZip.findOne({
        where: { zip_code: input.zip_code, city: input.city },
      });
      if (cityStateZip) {
        const address = await Address.findOne({
          where: {
            cityStateZipId: cityStateZip.id,
            street: input.street,
          },
        });
        if (address) {
          const combined = this._combineModelsToObject(address, cityStateZip);
          if (isMatch(input, combined)) {
            return Promise.resolve(this._formatOutput(combined));
          }
        }
      }
    } catch (e) {
      throw new ErrorHandler(503, "DB Service Unavailable");
    }

    return Promise.resolve(null);
  }

  async _mapSericeVerifyAndCreate(input) {
    const serviceAddressData = await this.mapService.addressLookup(input);
    if (isMatch(input, serviceAddressData)) {
      this._createEntries(serviceAddressData);
      return Promise.resolve(this._formatOutput(serviceAddressData));
    }
    return Promise.resolve(null);
  }

  async _createEntries(serviceAddressData) {
    try {
      let cityStateZip = await CityStateZip.findOne({
        where: {
          zip_code: serviceAddressData.zip_code,
          city: serviceAddressData.city,
        },
      });
      if (!cityStateZip) {
        cityStateZip = await CityStateZip.create({
          city: serviceAddressData.city,
          state: serviceAddressData.state,
          zip_code: serviceAddressData.zip_code,
        });
      }
      await Address.create({
        street: serviceAddressData.street,
        cityStateZipId: cityStateZip.id,
        lat: serviceAddressData.lat,
        lon: serviceAddressData.lon,
      });
    } catch (e) {}
  }

  _serializeInput(input) {
    const combinedAddress = combineAddressComponent(input);
    const parsedData = parser.parseLocation(combinedAddress);
    return {
      address: combinedAddress,
      street: combineStreetComponent(parsedData),
      city: parsedData.city,
      state: parsedData.state,
      zip_code: parsedData.zip,
    };
  }

  _combineModelsToObject(address, cityStateZip) {
    return {
      street: address.street,
      city: cityStateZip.city,
      state: cityStateZip.state,
      zip_code: cityStateZip.zip_code,
      lat: address.lat,
      lon: address.lon,
    };
  }

  _formatOutput(addressData) {
    return {
      address_line_one: addressData.street,
      city: addressData.city,
      state: addressData.state,
      zip_code: addressData.zip_code,
      latitude: addressData.lat,
      longitude: addressData.lon,
    };
  }
}
