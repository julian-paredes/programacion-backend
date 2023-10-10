import { Router } from "express";
import passport, { session } from "passport";
import jwt from "jsonwebtoken";

const router = Router()
// const usersService = new UsersManager()

router.post('/register', passport.authenticate('register',{failureRedirect: '/api/sessions/authFail', session: false}),async(req,res) => {
    res.status(200).send({status: "success", payload: req.user._id})
})


router.post('/login', passport.authenticate('login',{failureRedirect:'/api/sessions/authFail', session: false}), async(req,res) => {
    
    const tokenizedUser = {
        name: `${req.user.firstName} ${req.user.lastName}`,
        id: req.user._id,
        role: req.user.role
    }
    const token = jwt.sign(tokenizedUser,'secretjwtmusicstore',{expiresIn:'2h'})
    res.cookie('authCookie', token, {httpOnly: true}).send({status:"success", message: "Logged in"})

    res.send({status: "success", message: "User logged in"})
})

router.get('/current',passport.authenticate('jwt', {session: false}), async (req,res) => {
    const user = req.user
    res.send({status: "success", payload: user})
})

// Autenticacion de terceros

router.get('/github', passport.authenticate('github',{session: false}), (req,res) => {}) //Trigger

router.get('/githubcallback', passport.authenticate('github'),(req,res) => {    //Aqui se ve toda la info del user
    req.session.user = req.user
    res.redirect('/')
})

router.get('/authFail',(req,res)=>{
    //Si cayó a este endpoint, significa que falló.
    console.log(req.session.messages);
    if(req.session.messages){
        res.status(401).send({status:"error",error:req.session.messages[0]})
    }else{
        res.status(401).send({status:"error",error:"Error de input incompleto para estrategia de passport"})
    }
})

router.get('/logout', async (req,res) => {
    req.session.destroy(error => {
        if (error){
            console.log("Error:", error);
            return res.redirect('/login')
        } else {
            return res.redirect('/login')
        }
    })
})



export default router