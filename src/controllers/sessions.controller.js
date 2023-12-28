import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { usersService } from "../services/index.js";
import auth from "../services/auth.js";
import MailerService from "../services/mailerService.js";
import DMailTemplates from "../constants/DMailTemplates.js";


const register = async(req,res) => {
    res.clearCookie('cart')
    res.sendSuccess('Registered')
}

const login = async (req,res) => {
    const tokenizedUser = {
        name: `${req.user.firstName} ${req.user.lastName}`,
        id: req.user._id,
        role: req.user.role,
        cart: req.user.cart
    }
    const token = jwt.sign(tokenizedUser,config.jwt.JWT_SECRET,{expiresIn:'2h'})
    res.cookie(config.jwt.JWT_COOKIE,token,{httpOnly: true})
    res.clearCookie('cart')
    res.sendSuccess('Logged In')
}

const current = async(req,res) => {
    res.sendSuccessWithPayload(req.user)
}

const logout = async (req,res) => {
    res.clearCookie(config.jwt.JWT_COOKIE)
    return res.redirect('/login')   
    }

const passwordRestoreRequest = async (req,res) => {
    const {email} = req.body
    const user = await usersService.getUserById({email})
    if(!user) return res.sendBadRequest('User does not exist')
    const token = jwt.sign({email},config.jwt.JWT_SECRET,{expiresIn: "5m"})
    const mailerService = new MailerService()
    const result = await mailerService.sendMail([email], DMailTemplates.PWD_RESTORE,{token})
    res.sendSuccess('Email sent')
}

const passwordRestore = async (req,res) => {

    try {
        const {newPassword, token} = req.body
        if (!newPassword || !token) return res.sendBadRequest('Incomplete values')
        const {email} = jwt.verify(token,config.jwt.JWT_SECRET)
        const user = await usersService.getUserById({email})
        if(!user) return res.sendBadRequest('User does not exist')
        const isPasswordValid = await auth.validatePassword(newPassword,user.password)
        if(isPasswordValid) return res.sendBadRequest('Password must be different')

        const hashedPassword = await auth.createHash(newPassword)
        await usersService.updateUser(user._id,{password: hashedPassword})
        
        res.sendSuccess('Password restored')

    } catch (error) {
        console.log(error)
        res.sendBadRequest('Invalid token')
    }
}

export default {
    register,
    login,
    current,
    logout,
    passwordRestoreRequest,
    passwordRestore
}
