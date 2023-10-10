import passportCall from "../middlewares/passportCall.js";
import BaseRouter from "./BaseRouter.js";
import jwt from "jsonwebtoken";

class NewSessionsRouter extends BaseRouter {
    init(){
        this.post('/register',['NO_AUTH'], passportCall('register',{strategyType: 'LOCALS'}), async(req,res) => {
            res.sendSuccess('Registered')
        })

        this.post('/login',["NO_AUTH"], passportCall('login',{strategyType: 'LOCALS'}), async (req,res) => {
            const tokenizedUser = {
                name: `${req.user.firstName} ${req.user.lastName}`,
                id: req.user._id,
                role: req.user.role
            }
            const token = jwt.sign(tokenizedUser,'secretjwtmusicstore',{expiresIn:'2h'})
            res.cookie('authCookie',token,{httpOnly: true})
            res.sendSuccess('Logged In')
        })

        this.get('/current', passportCall('jwt'), async(req,res) => {
            res.sendSuccessWithPayload(req.user)
        })
    }
}

const sessionsRouter = new NewSessionsRouter()

export default sessionsRouter.getRouter()