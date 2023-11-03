import config from "../config/config.js";

export default class PersistenceFactory {

    static getPersistence = async() => {

        let ProductsDao
        let CartsDao
        let UsersDao

        switch (config.app.PERSISTENCE) {
            case "FS": {
                ProductsDao = (await import("./filesystem/ProductsDao.js")).default
                CartsDao = (await import("./filesystem/CartsDao.js")).default
            break;
            }
            case "MONGO": {
                ProductsDao = (await import("./mongo/ProductsDao.js")).default
                CartsDao = (await import("./mongo/CartsDao.js")).default
                UsersDao = (await import("./mongo/UsersDao.js")).default

            break;
            }
        }

        return {
            ProductsDao,
            CartsDao,
            UsersDao,
        }
    }
}