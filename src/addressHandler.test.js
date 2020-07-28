import "babel-polyfill";
import AddressHandler from "./addressHandler";

let mockAFindOne;
let mockACreate;
let mockCSZFindOne;
let mockCSZCreate;

jest.mock("../models", () => {
  const mockAddressFindOne = jest.fn();
  const mockAddressCreate = jest.fn();
  const mockCityStateZipFindOne = jest
    .fn()
    .mockImplementation(() => Promise.resolve());
  const mockCityStateZipCreate = jest
    .fn()
    .mockImplementation(() => Promise.resolve({ id: 1 }));
  mockCSZFindOne = mockCityStateZipFindOne;
  mockCSZCreate = mockCityStateZipCreate;
  mockAFindOne = mockAddressFindOne;
  mockACreate = mockAddressCreate;
  return {
    Address: {
      findOne: mockAddressFindOne,
      create: mockAddressCreate,
    },
    CityStateZip: {
      findOne: mockCityStateZipFindOne,
      create: mockCityStateZipCreate,
    },
  };
});

const address = {
  street: "1 test st",
  lat: 1,
  lon: 2,
};

const cityStateZip = {
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
    beforeEach(() => {
      addressHandler = new AddressHandler({});
    });

    describe("_dbVerification", () => {
      test("should call CityZip findOne", () => {
        addressHandler._dbVerification(addressData);
        const output = {
          where: {
            zip_code: addressData.zip_code,
            city: addressData.city,
            state: addressData.state,
          },
        };
        expect(mockCSZFindOne).toHaveBeenCalledWith(output);
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
        addressHandler._mapSericeVerifyAndCreate(addressData);
        expect(mockAddressLookup).toHaveBeenCalledWith(addressData);
      });
    });

    describe("_createEntries", () => {
      test("should call CityStateZip findOne", () => {
        addressHandler._createEntries(addressData);
        const output = {
          where: {
            zip_code: addressData.zip_code,
            city: addressData.city,
          },
        };
        expect(mockCSZFindOne).toHaveBeenCalledWith(output);
      });
      test("should call CityStateZip create", () => {
        addressHandler._createEntries(addressData);
        const output = {
          zip_code: addressData.zip_code,
          state: addressData.state,
          city: addressData.city,
        };
        expect(mockCSZCreate).toHaveBeenCalledWith(output);
      });
      test("should call CityStateZip create", () => {
        addressHandler._createEntries(addressData);
        const output = {
          street: addressData.street,
          cityStateZipId: 1,
          lat: addressData.lat,
          lon: addressData.lon,
        };
        expect(mockACreate).toHaveBeenCalledWith(output);
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
          addressHandler._combineModelsToObject(address, cityStateZip)
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
