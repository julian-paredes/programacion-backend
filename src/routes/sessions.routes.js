import { Router } from "express";
import UsersManager from "../dao/mongo/managers/UsersManager.js";

const router = Router()
const usersService = new UsersManager()

router.post('/register', async(req,res) => {

    const {
        firstName,
        lastName,
        email,
        age,
        password
    } = req.body

    if(!firstName || !lastName || !email || !age || !password) return res.status(400).send({status: "error", message: "Complete todos los datos"})

    const newUser = {
        firstName,
        lastName,
        email,
        age,
        password
    }

    const result  = await usersService.createUser(newUser)
    if (result) 
    res.status(200).send({status: "success", payload: result._id})
})


router.post('/login', async(req,res) => {
    const {email,password} = req.body
    if(!email || !password) return res.status(400).send({status: "error", message: "Complete todos los datos"})

    if (email === "adminCoder@coder.com" && password === "adminCod3r123"){
        const adminUser = {
            firstName: "Admin",
            lastName: "Admin",
            email: "adminCoder@coder.com",
            role: "admin"
        }
        req.session.user = adminUser
        res.send({status: 'success', message: 'Usuario logueado'})
        return
    }

    const user = await usersService.getUserById({email,password})
    if (!user) return res.status(400).send({status: "error", message: "Credenciales incorrectas"})
    
    req.session.user = user
    res.send({status: 'success', message: 'Usuario logueado'})
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