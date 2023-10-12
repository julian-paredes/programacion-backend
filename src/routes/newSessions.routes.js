import config from "../config/config.js";
import passportCall from "../middlewares/passportCall.js";
import BaseRouter from "./BaseRouter.js";
import jwt from "jsonwebtoken";

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

        this.get('/current',['AUTH'], passportCall('jwt'), async(req,res) => {
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
        }
    }

const sessionsRouter = new NewSessionsRouter()

export default sessionsRouter.getRouter()