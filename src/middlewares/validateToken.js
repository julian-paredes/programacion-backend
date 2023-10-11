import jwt from "jsonwebtoken"
import config from "../config/config.js"

export const validateJWT = (req,res,next) => {

    try {
        const authHeader = req.headers.authorization
        if(!authHeader) return res.status(401).send({status: "error", message: "User not loggeed"})    
        const token = authHeader.split(' ')[1]
        const userInfo = jwt.verify(token,config.jwt.JWT_SECRET)
        req.user = userInfo
        next()
    } catch (error) {
        console.log(error)
        res.status(401).send({status: "error", error: error})
    }
}