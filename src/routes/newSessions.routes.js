import passportCall from "../middlewares/passportCall.js";
import BaseRouter from "./BaseRouter.js";
import sessionsController from "../controllers/sessions.controller.js";

class NewSessionsRouter extends BaseRouter {
    init(){
        this.post('/register',['NO_AUTH'], passportCall('register',{strategyType: 'LOCALS'}), sessionsController.register)

        this.post('/login',["NO_AUTH"], passportCall('login',{strategyType: 'LOCALS'}), sessionsController.login)

        this.get('/current',['AUTH'], sessionsController.current)

        this.get('/github',["NO_AUTH"], passportCall('github',{strategyType: 'GITHUB'}), (req,res) => {})

        this.get('/githubcallback',["NO_AUTH"], passportCall('github',{strategyType: 'GITHUB'}),(req,res) => { 
            res.redirect('/')
        })

        this.get('/logout',["AUTH"], sessionsController.logout)
        this.post('/restorePassword',["PUBLIC"], sessionsController.passwordRestoreRequest)

        this.put('/password-restore',["PUBLIC"], sessionsController.passwordRestore)
    }
}

const sessionsRouter = new NewSessionsRouter()

export default sessionsRouter.getRouter()