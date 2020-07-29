import faker from "faker";
import models from "../../models";

const data = async (props = {}) => {
  const defaultProps = {
    city: faker.address.city(),
    state: faker.address.state(),
    zip_code: faker.address.zipCode(),
  };
  return Object.assign({}, defaultProps, props);
};

export default async (props = {}) =>
  models.CityStateZip.create(await data(props));
