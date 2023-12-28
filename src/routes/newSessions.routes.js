import config from "../config/config.js";
import passportCall from "../middlewares/passportCall.js";
import BaseRouter from "./BaseRouter.js";
import jwt from "jsonwebtoken";
import { usersService } from "../services/index.js";
import MailerService from "../services/mailerService.js";
import DMailTemplates from "../constants/DMailTemplates.js";
import auth from "../services/auth.js";

class NewSessionsRouter extends BaseRouter {
    init(){
        this.post('/register',['NO_AUTH'], passportCall('register',{strategyType: 'LOCALS'}), async(req,res) => {
            res.clearCookie('cart')
            res.sendSuccess('Registered')
        })

        this.post('/login',["NO_AUTH"], passportCall('login',{strategyType: 'LOCALS'}), async (req,res) => {
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
        })

        this.get('/current',['AUTH'], async(req,res) => {
            res.sendSuccessWithPayload(req.user)
        })

        this.get('/github',["NO_AUTH"], passportCall('github',{strategyType: 'GITHUB'}), (req,res) => {})

        this.get('/githubcallback',["NO_AUTH"], passportCall('github',{strategyType: 'GITHUB'}),(req,res) => {    //Aqui se ve toda la info del user
            res.redirect('/')
        })

        this.get('/logout',["AUTH"], async (req,res) => {
            res.clearCookie(config.jwt.JWT_COOKIE)
            return res.redirect('/login')
                
            })
        this.post('/restorePassword',["PUBLIC"], async (req,res) => {
            const {email} = req.body
            const user = await usersService.getUserById({email})
            if(!user) return res.sendBadRequest('User does not exist')
            const token = jwt.sign({email},config.jwt.JWT_SECRET,{expiresIn: "5m"})
            const mailerService = new MailerService()
            const result = await mailerService.sendMail([email], DMailTemplates.PWD_RESTORE,{token})
            res.sendSuccess('Email sent')
        })

        this.put('/password-restore',["PUBLIC"], async (req,res) => {

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
        })
    }
}

const sessionsRouter = new NewSessionsRouter()

export default sessionsRouter.getRouter()