import faker from "faker";
import models from "../../models";

const data = async (props = {}) => {
  const defaultProps = {
    address: faker.address.streetAddress(),
    lat: faker.address.latitude(),
    lon: faker.address.longitude(),
  };
  return Object.assign({}, defaultProps, props);
};

export default async (props = {}) => models.Address.create(await data(props));
