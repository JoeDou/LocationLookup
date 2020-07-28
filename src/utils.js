const streetComponents = [
  "number",
  "prefix",
  "street",
  "type",
  "suffix",
  "sec_unit_type",
  "sec_unit_num",
];

const inputComponents = ["address_line_one", "city", "state", "zip_code"];

const addressComponents = ["street", "city", "state", "zip_code"];

// combine input components to create an address string
export const combineInputComponent = (parsedData) => {
  const list = [];
  inputComponents.forEach((key) => {
    list.push(parsedData[key]);
  });
  return list.join(", ").toLowerCase();
};

// combined parsed street data to create an street string
export const combineStreetComponent = (parsedData) => {
  const list = [];
  streetComponents.forEach((key) => {
    if (parsedData[key]) {
      list.push(parsedData[key]);
    }
  });
  return list.join(" ").toLowerCase();
};

// check the two object to make sure that the values match, Google
// does fuzzy matching so its important to make sure that input and
// results from google map matches
export const isMatch = (obj1, obj2) => {
  return addressComponents.reduce(
    (cum, key) =>
      cum &&
      Boolean(obj1[key]) &&
      Boolean(obj2[key]) &&
      obj1[key].toLowerCase().replace(/[\W_]+/g, " ") ===
        obj2[key].toLowerCase().replace(/[\W_]+/g, " "),
    true
  );
};

// ErrorHandler class for customized error data
export class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

// streamline error output message to clients
export const handleError = (err, res) => {
  const { statusCode, message } = err;
  res.status(statusCode || 500).json({
    status: "error",
    statusCode,
    message,
  });
};

// wrapper function to work with async functions
export function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
}
