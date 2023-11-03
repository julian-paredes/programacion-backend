import usersModel from "./models/users.js";

export default class UsersDao {

    getUsers = () => {
        return usersModel.find().lean()
    }

    getUserById = (params) => {
        return usersModel.findOne(params).lean()
    }

    createUser = (user) => {
        return usersModel.create(user)
    }

    updateUser = (id,user) => {
        return usersModel.updateOne({_id: id}, user)
    }

    deleteUser = (id) => {
        return usersModel.deleteOne({_id: id})
    }
}