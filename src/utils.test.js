import {
  combineInputComponent,
  combineStreetComponent,
  isMatch,
  ErrorHandler,
  handleError,
} from "./utils";

describe("utils functions", () => {
  describe("combineInputComponent function", () => {
    test("should combine input component into lowercase string", () => {
      const input = {
        address_line_one: "1 Test St",
        city: "San Jose",
        state: "CA",
        zip_code: "95123",
      };
      const output = "1 test st, san jose, ca, 95123";
      expect(combineInputComponent(input)).toBe(output);
    });
  });

  describe("combineStreetComponent function", () => {
    test("should combine street component into a lowercase string", () => {
      const input = {
        number: "1",
        prefix: "W",
        street: "Main",
        type: "St",
        sec_unit_type: "Apt",
        sec_unit_num: "1",
      };
      const output = "1 w main st apt 1";
      expect(combineStreetComponent(input)).toBe(output);
    });
  });

  describe("isMatch function", () => {
    let obj1;
    beforeEach(() => {
      obj1 = {
        street: "1 Test St",
        city: "San Jose",
        state: "CA",
        zip_code: "95123",
      };
    });
    test("should return true with two object has the same values for each key", () => {
      const obj2 = { ...obj1 };
      expect(isMatch(obj1, obj2)).toBe(true);
    });
    test("should return true with two object only differ by non-alpha numeric char and capitalization for each key", () => {
      const obj2 = {
        street: "1 test st",
        city: "San-Jose",
        state: "CA",
        zip_code: "95123",
      };
      expect(isMatch(obj1, obj2)).toBe(true);
    });
    test("should return false if missing key", () => {
      const obj2 = {
        street: "1 Test St",
        city: "San Jose",
        state: "CA",
      };
      expect(isMatch(obj1, obj2)).toBe(false);
    });
    test("should return false if string of any key does not match", () => {
      const obj2 = {
        street: "1 Hi St",
        city: "San Jose",
        state: "CA",
        zip_code: "95123",
      };
      expect(isMatch(obj1, obj2)).toBe(false);
    });
  });

  describe("ErrorHandler Class", () => {
    test("expect ErrorHandler to hold status code and message", () => {
      const err = new ErrorHandler(400, "oh no");
      expect(err.statusCode).toBe(400);
      expect(err.message).toBe("oh no");
    });
  });

  describe("handleError function", () => {
    test("expect use status code and message and push it through res", () => {
      const mockStatus = jest.fn(() => this);
      const mockJson = jest.fn();
      const mockRes = {
        status: mockStatus,
        json: mockJson,
      };
      mockStatus.mockImplementation(() => mockRes);
      const err = {
        statusCode: 400,
        message: "oh no",
      };
      handleError(err, mockRes);
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        status: "error",
        statusCode: err.statusCode,
        message: err.message,
      });
    });
  });
});
