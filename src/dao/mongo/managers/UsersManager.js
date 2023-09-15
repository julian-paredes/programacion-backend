import usersModel from "../models/users.js";

export default class UsersManager {

    getUsers = () => {
        return usersModel.find().lean()
    }

    getUserById = (params) => {
        return usersModel.findOne(params).lean()
    }

    createUser = (user) => {
        return usersModel.create(user)
    }
}