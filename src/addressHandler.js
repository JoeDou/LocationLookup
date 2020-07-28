import parser from "parse-address";
import { Address, CityStateZip } from "../models";
import {
  combineStreetComponent,
  combineInputComponent,
  isMatch,
  ErrorHandler,
} from "./utils";

// AddressHandler Class is the controller that handles the
// verification and write to DB
export default class AddressHandler {
  constructor(mapService) {
    this.mapService = mapService;
    this.verifyAndCreateAll = this.verifyAndCreateAll.bind(this);
  }

  // the route handler entry, will map each address to be handle
  // individually. Once all the promise resolves will then return
  // the response
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

  // Verify and create individual address.  Will start by looking at db and
  // if there is not match will followup with mapService verification
  async _verifyAndCreateOne(input) {
    let output = await this._dbVerification(input);
    if (!output) {
      output = await this._mapSericeVerifyAndCreate(input);
    }
    return Promise.resolve(output);
  }

  // Logic for db verification.  This verification process is a strict match,
  // there a lot of edge cases, but it makes more sense for to google api to
  // resolve those edge cases.
  async _dbVerification(input) {
    try {
      const cityStateZip = await CityStateZip.findOne({
        where: {
          zip_code: input.zip_code,
          city: input.city,
          state: input.state,
        },
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
          return Promise.resolve(this._formatOutput(combined));
        }
      }
    } catch (e) {
      throw new ErrorHandler(503, "DB Service Unavailable");
    }

    return Promise.resolve(null);
  }

  // Logic for verification use google map service and if create entires in DB
  // if the address is validated.  NOTE: _createEntries is not part of the
  // main async process because the response does not require all the data to finish
  // writing to DB, all it need to know is if the address is valid or not
  async _mapSericeVerifyAndCreate(input) {
    const serviceAddressData = await this.mapService.addressLookup(input);
    if (isMatch(input, serviceAddressData)) {
      this._createEntries(serviceAddressData);
      return Promise.resolve(this._formatOutput(serviceAddressData));
    }
    return Promise.resolve(null);
  }

  // logic to create entires in Address table and CityStateZip table
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

  // serialize the input data into a format expected by internal functions
  _serializeInput(input) {
    const combinedInput = combineInputComponent(input);
    const parsedData = parser.parseLocation(combinedInput);
    return {
      address: combinedInput,
      street: combineStreetComponent(parsedData),
      city: parsedData.city,
      state: parsedData.state,
      zip_code: parsedData.zip,
    };
  }

  // combine Models and save data into object to be easily consumed by
  // internal functions
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

  // format output data to meet requirement
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
