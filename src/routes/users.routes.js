import usersController from "../controllers/users.controller.js"
import BaseRouter from "./BaseRouter.js"


class UsersRouter extends BaseRouter {
    init(){
        this.get('/', ['ADMIN'], usersController.getUsers)
        this.get('/:uid', ['NO_AUTH'], usersController.getUserById)
        this.post('/', ['PUBLIC'], usersController.createUser)
        this.put('/:user', ['USER'], usersController.updateUser)
        this.put('/premium/:uid', ['USER'], usersController.updatePremium)
        this.delete('/:uid', ['ADMIN'], usersController.deleteUser)
    }
}

const usersRouter = new UsersRouter()
export default usersRouter.getRouter()
