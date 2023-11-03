import ProductsService from "./ProductsService.js";
import CartsService from "./CartsService.js";
import ProductsManager from "../dao/mongo/managers/ProductsManager.js";
import CartsManager from "../dao/mongo/managers/CartsManager.js";


export const productsService = new ProductsService(new ProductsManager())
export const cartsService = new CartsService(new CartsManager())