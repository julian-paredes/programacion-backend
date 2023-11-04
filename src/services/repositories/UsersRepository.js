
export default class UsersRepository {
    constructor(dao) {
        this.dao = dao
    }

    getUsers = () => {
        return this.dao.getUsers()
    }

    getUserById = (params) => {
        return this.dao.getUserById(params)
    }

    createUser = (user) => {
        return this.dao.createUser(user)
    }

    updateUser = (id,user) => {
        return this.dao.updateUser(id,user)
    }

    deleteUser = (id) => {
        return this.dao.deleteUser(id)
    }
}