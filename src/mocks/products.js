import { faker } from "@faker-js/faker/locale/es";

export const generateProduct = () => {

    const categories = ["drums","bass","guitar","keyboards"]

    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.string.alphanumeric(10),
        price: faker.commerce.price(),
        status: faker.datatype.boolean(),
        stock: faker.number.int({min: 0, max: 30}),
        category: faker.helpers.arrayElement(categories),
        thumbnail: faker.image.urlLoremFlickr({ category: faker.helpers.arrayElement(categories) })
    }
}