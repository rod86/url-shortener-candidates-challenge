import {faker} from "@faker-js/faker";

export const shortCode = (): string => faker.string.alphanumeric(5);
