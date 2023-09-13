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
    console.log(req.body);
    
    res.send({status: 'success', message: 'Usuario logueado'})
})

export default router