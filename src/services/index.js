import ProductsRepository from "./repositories/ProductsRepository.js";
import CartsRepository from "./repositories/CartsRepository.js";
import UsersRepository from "./repositories/UsersRepository.js"
import TicketsReposiory from "./repositories/TicketsRepository.js"

import PersistenceFactory from "../dao/PersistenceFactory.js";

const { ProductsDao, CartsDao, UsersDao, TicketsDao } = await PersistenceFactory.getPersistence()

export const productsService = new ProductsRepository(new ProductsDao())
export const cartsService = new CartsRepository(new CartsDao())
export const usersService = new UsersRepository(new UsersDao())
export const ticketsService = new TicketsReposiory(new TicketsDao())