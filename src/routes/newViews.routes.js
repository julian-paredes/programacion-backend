import BaseRouter from "./BaseRouter.js";
import viewsController from "../controllers/views.controller.js";

class newViewsRouter extends BaseRouter {

    init(){

        this.get("/",['PUBLIC'], viewsController.renderHome);

        this.get('/profile',['AUTH'], viewsController.renderProfile)

        this.get('/register',['NO_AUTH'], viewsController.renderRegister)

        this.get('/login',['NO_AUTH'], viewsController.renderLogin)

        this.get('/users',['ADMIN'], viewsController.renderUsers)

        this.get('/cart',['AUTH'], viewsController.renderCart)

        this.get("/purchase", ["AUTH"], viewsController.renderPurchase);

        this.get('/password-restore',['PUBLIC'], viewsController.renderPasswordRestore)
    }
}

const viewsRouter = new newViewsRouter()

export default viewsRouter.getRouter()