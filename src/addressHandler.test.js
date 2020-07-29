import "babel-polyfill";
import AddressHandler from "./addressHandler";
import { Address, CityStateZip } from "../models";
import clean from "../test/clean";
import addressFactory from "../test/factories/address";
import cityStateZipFactory from "../test/factories/cityStateZip";

const mockAddress = {
  street: "1 test st",
  lat: 1,
  lon: 2,
};

const mockCityStateZip = {
  city: "san jose",
  state: "ca",
  zip_code: "12345",
};

const addressData = {
  street: "1 test st",
  city: "san jose",
  state: "ca",
  zip_code: "12345",
  lat: 1,
  lon: 2,
};

const formattedOutput = {
  address_line_one: "1 test st",
  city: "san jose",
  state: "ca",
  zip_code: "12345",
  latitude: 1,
  longitude: 2,
};

describe("addressHandler", () => {
  describe("AddressHandler Class", () => {
    let addressHandler;
    beforeEach(async () => {
      addressHandler = new AddressHandler({});
      await clean();
    });

    describe("_dbVerification", () => {
      test("should return null if there are no match", async () => {
        const out = await addressHandler._dbVerification(addressData);
        expect(out).toBe(null);
      });

      test("should return null if only match cityStateZip", async () => {
        const preCount = await CityStateZip.count();
        await cityStateZipFactory({
          city: addressData.city,
          state: addressData.state,
          zip_code: addressData.zip_code,
        });
        const postCount = await CityStateZip.count();
        const out = await addressHandler._dbVerification(addressData);
        expect(preCount).toBe(0);
        expect(postCount).toBe(1);
        expect(out).toBe(null);
      });

      test("should call _combineModelsToObject and _formatOutput if match cityStateZip and address", async () => {
        const csz = await cityStateZipFactory({
          city: addressData.city,
          state: addressData.state,
          zip_code: addressData.zip_code,
        });
        await addressFactory({
          street: addressData.street,
          cityStateZipId: csz.id,
        });
        const mockCombine = jest.fn();
        const mockFormat = jest.fn();
        addressHandler._combineModelsToObject = mockCombine;
        addressHandler._formatOutput = mockFormat;
        await addressHandler._dbVerification(addressData);
        expect(mockCombine).toHaveBeenCalledTimes(1);
        expect(mockFormat).toHaveBeenCalledTimes(1);
      });
    });

    describe("_mapSericeVerifyAndCreate", () => {
      test("should call mapService addressLoopup function", () => {
        const mockAddressLookup = jest
          .fn()
          .mockImplementation(() => Promise.resolve(addressData));
        const mockMapService = {
          addressLookup: mockAddressLookup,
        };
        addressHandler = new AddressHandler(mockMapService);
        addressHandler._createEntries = jest.fn();
        addressHandler._mapSericeVerifyAndCreate(addressData);
        expect(mockAddressLookup).toHaveBeenCalledWith(addressData);
      });
    });

    describe("_createEntries", () => {
      test("should create CityStateZip and Address if doesn't exist", async () => {
        await addressHandler._createEntries(addressData);
        const address1 = await Address.findOne({
          where: {
            street: addressData.street,
          },
        });
        const addressCount = await Address.count();
        const cityStateZip1 = await CityStateZip.findOne({
          where: {
            city: addressData.city,
            zip_code: addressData.zip_code,
          },
        });
        const cityStateZipcount = await CityStateZip.count();
        expect(addressCount).toBe(1);
        expect(address1.lat).toBe(addressData.lat);
        expect(address1.lon).toBe(addressData.lon);
        expect(cityStateZipcount).toBe(1);
        expect(cityStateZip1.state).toBe(cityStateZip1.state);
      });
      test("should not create CityStateZip if exists", async () => {
        await cityStateZipFactory({
          city: "san jose",
          state: "ca",
          zip_code: "12345",
        });
        const preCount = await CityStateZip.count();
        await addressHandler._createEntries(addressData);
        const postCount = await CityStateZip.count();

        expect(preCount).toBe(1);
        expect(postCount).toBe(1);
      });
    });

    describe("_serializeInput", () => {
      test("should serialize input into expected format", () => {
        const input = {
          address_line_one: "1 test st",
          city: "san jose",
          state: "ca",
          zip_code: "12345",
        };
        const output = {
          address: "1 test st, san jose, ca, 12345",
          street: "1 test st",
          city: "san jose",
          state: "ca",
          zip_code: "12345",
        };
        expect(addressHandler._serializeInput(input)).toEqual(output);
      });
    });

    describe("_combineModelsToObject", () => {
      test("should combine address and cityStateZip models in to one addres object", () => {
        expect(
          addressHandler._combineModelsToObject(mockAddress, mockCityStateZip)
        ).toEqual(addressData);
      });
    });

    describe("_formatOutput", () => {
      test("should map data object to output format", () => {
        expect(addressHandler._formatOutput(addressData)).toEqual(
          formattedOutput
        );
      });
    });
  });
});
