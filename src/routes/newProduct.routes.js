import BaseRouter from "./BaseRouter.js";
import productsController from "../controllers/products.controller.js";
class newProductRouter extends BaseRouter {

    init(){

        this.get("/",['NO_AUTH'], productsController.getProducts);

        this.get("/:pid",['NO_AUTH'], productsController.getProductsById);

        this.post("/",['ADMIN'], productsController.createProduct);

        this.put('/:pid',['ADMIN'], productsController.updateProduct)

        this.delete("/:pid",['ADMIN'], productsController.deleteProduct)
    }
}

const productsRouter = new newProductRouter()

export default productsRouter.getRouter()