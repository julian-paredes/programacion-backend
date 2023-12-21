import BaseRouter from "./BaseRouter.js";
import cartsController from "../controllers/carts.controller.js";

class newCartRouter extends BaseRouter {

    init(){

        this.get("/:cid",['AUTH'], cartsController.getCartById);

        this.post("/",['ADMIN'], cartsController.createCart);

        this.post("/:cid/product/:pid",['NO_AUTH'], cartsController.updateCart);

        this.post("/product/:pid",['AUTH'], cartsController.addProductToCart);

        this.put("/:cid",['NO_AUTH'], cartsController.addProductToCartInBody)

        this.put("/:cid/products/:pid",['NO_AUTH'], cartsController.updateCarttUnits)

        this.delete("/:cid",['ADMIN'], cartsController.deleteAllProductsFromCartById)

        this.delete("/:cid/products/:pid",['NO_AUTH'], cartsController.deleteProductFromCartById)

        this.post("/:cid/purchase", ["AUTH"], cartsController.purchaseCart);
    }
}

const cartsRouter = new newCartRouter()

export default cartsRouter.getRouter()