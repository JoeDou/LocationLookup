import "babel-polyfill";
import MapServices from "./map-services";

describe("map-service", () => {
  describe("MapService class", () => {
    describe("addressLookup", () => {
      test("should call _request function", () => {
        const mapService = new MapServices({});
        const mockRequest = jest.fn();
        mapService._request = mockRequest;
        const addressObj = { address: "1 test st" };
        mapService.addressLookup(addressObj);
        expect(mockRequest).toHaveBeenCalledWith(addressObj.address);
      });
    });

    describe("_requst", () => {
      test("should call client geocode", () => {
        const mockGeoCode = jest
          .fn()
          .mockImplementation(() => Promise.resolve({}));
        const client = {
          geocode: mockGeoCode,
        };
        const mockGoogleMapper = jest.fn();
        const mapService = new MapServices(client);
        mapService._googleMapper = mockGoogleMapper;
        const address = "1 test st";
        mapService._request(address);
        const output = {
          params: {
            address,
            key: "api_key",
          },
          timeout: 1000,
        };
        expect(mockGeoCode).toHaveBeenCalledWith(output);
      });
    });

    describe("_googleMapper", () => {
      const geocodeData = {
        data: {
          results: [
            {
              formatted_address: "1 test st, san jose, ca, 95123",
              geometry: {
                location: {
                  lat: 1,
                  lng: 2,
                },
              },
            },
          ],
        },
      };
      const mapService = new MapServices({});
      const output = {
        street: "1 test st",
        lat: 1,
        lon: 2,
        city: "san jose",
        state: "ca",
        zip_code: "95123",
      };
      expect(mapService._googleMapper(geocodeData)).toEqual(output);
    });
  });
});
