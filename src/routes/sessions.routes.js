import { Router } from "express";
import passport from "passport";


const router = Router()
// const usersService = new UsersManager()

router.post('/register', passport.authenticate('register',{failureRedirect: '/api/sessions/authFail', failureMessage: true}),async(req,res) => {
    res.status(200).send({status: "success", payload: req.user._id})
})


router.post('/login', passport.authenticate('login',{failureRedirect:'/api/sessions/authFail', failureMessage: true}), async(req,res) => {

    req.session.user = req.user
    res.send({status: "success", message: "User logged in"})
})

router.get('/authFail', (req,res) => {
    res.status(401).send({status: "error", message:"Error de autenticacion"})
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

// router.get('/eliminarProductos',(req,res)=>{
//     //Número uno, ¿Ya tiene credenciales (ya puedo identificarlo)?
//     if(!req.session.user) return res.status(401).send({status:"error",error:"Not logged in"});
//     //Si llega a esta línea, entonces ya sé quién es
//     //Ahora necesito corroborar si tiene el permiso suficiente
//     if(req.session.user.role!=="admin") return res.status(403).send({status:'error',error:'No permitido'});
//     //Si llegué hasta acá, sí te conozco, y SÍ tienes permisos
//     res.send({status:"success",message:"Productos eliminados"})
// })

export default router