
export default class UsersService {
    constructor(manager) {
        this.manager = manager
    }

    getUsers = () => {
        return this.manager.getUsers()
    }

    getUserById = (params) => {
        return this.manager.getUserById(params)
    }

    createUser = (user) => {
        return this.manager.createUser(user)
    }

    updateUser = (id,user) => {
        return this.manager.updateUser(id,user)
    }

    deleteUser = (id) => {
        return this.manager.deleteUser(id)
    }
}