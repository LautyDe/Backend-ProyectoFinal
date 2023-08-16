import { faker } from "@faker-js/faker";

export const generateProduct = () => {
  const product = {
    id: faker.database.mongodbObjectId(),
    code: faker.string.alphanumeric(15),
    status: faker.datatype.boolean(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.number.float({ min: 0.1, max: 10000, precision: 0.01 }),
    thumbnail: "",
    category: faker.commerce.department(),
    stock: faker.number.int({ min: 0, max: 10000 }),
    __v: 0,
  };
  return product;
};
