import { faker } from "@faker-js/faker";

export const generateUserRegister = () => {
  const user = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    age: faker.number.int({ min: 18, max: 80 }),
    password: faker.internet.password(),
  };
  return user;
};
