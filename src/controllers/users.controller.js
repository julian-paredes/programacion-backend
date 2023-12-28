import config from "../config/config.js";
import UserDto from "../dto/userDto.js";
import { usersService } from "../services/index.js";



const getUsers = async (req, res) => {
    try {
      const users = await usersService.getUsers();
      const usersInfo = users.map((user) => {
        return {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,
        };
      })
      res.logger.info("Users retrieved");
      return res.send({status: "success", payload: usersInfo});
    } catch (error) {
        res.logger.error(error);
    }
}

const getUserById = async (req, res) => {
    try {
      const { uid } = req.params;
      const user = await usersService.getUserById({ _id: uid });
      if (!user) return res.sendBadRequest("User does not exist");
      res.logger.info("User retrieved");
      return res.send({status: "success", payload: user});
    } catch (error) {
        res.logger.error(error);
    }
}

const createUser = async (req, res) => {
  try {
    const result = await usersService.createUser()
    req.logger.info("User created successfully", result._id);
    return res.send({ status: "success", payload: result._id });
  } catch (error) {
    req.logger.error(error);
  }
}

const updateUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await usersService.getUserById({ _id: uid });
    if (!user) return res.sendBadRequest("User does not exist");
    const result = await usersService.updateUser(uid, req.body);
    req.logger.info("User updated successfully", {uid});
    return res.send({ status: "success", payload: result });
  } catch (error) {
    req.logger.error(error);
  }
}

const deleteUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await usersService.getUserById({ _id: uid });
    if (!user) return res.sendBadRequest("User does not exist");
    const result = await usersService.deleteUser(uid);
    req.logger.info("User deleted successfully", {uid});
    return res.send({ status: "success", payload: result });
  } catch (error) {
    req.logger.error(error);
  }
}

const updatePremium = async (req, res) => {
  try {
    const { uid } = req.user.id;
    const user = await usersService.getUserById({ _id: uid });
    if (!user) return res.sendBadRequest("User does not exist");

    if (user.role === "premium") {
      return res.sendBadRequest("User is already premium");
    }

    if (user.role === "user" && user.isPremium === true) {
      const updatedUser = await usersService.updateUser(
        { _id: uid },
        { role: "premium" }
      )

      const tokenizedUser = UserDto.getTokenDTOFrom(updatedUser);
      const token = jwt.sign(tokenizedUser, config.jwt.SECRET, {
        expiresIn: "1d",
      });

      req.logger.info("User upgraded", uid);
      return res
        .status(200)
        .send({ status: "success", message: "User upgraded successfully" });

    }
  } catch (error) {
    req.logger.error(error);
  }

}

export default {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    updatePremium
}