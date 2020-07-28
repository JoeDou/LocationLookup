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

export function combineAddressComponent(parsedData) {
  const list = [];
  inputComponents.forEach((key) => {
    list.push(parsedData[key]);
  });
  return list.join(", ").toLowerCase();
}

export function combineStreetComponent(parsedData) {
  const list = [];
  streetComponents.forEach((key) => {
    if (parsedData[key]) {
      list.push(parsedData[key]);
    }
  });
  return list.join(" ").toLowerCase();
}

export function isMatch(obj1, obj2) {
  return addressComponents.reduce(
    (cum, key) =>
      cum &&
      obj1[key] &&
      obj2[key] &&
      obj1[key].toLowerCase().replace(/[\W_]+/g, " ") ===
        obj2[key].toLowerCase().replace(/[\W_]+/g, " ")
  );
}
