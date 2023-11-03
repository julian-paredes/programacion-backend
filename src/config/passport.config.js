import passport from "passport"
import local from "passport-local"
import GithubStrategy from "passport-github2"
import UsersDao from "../dao/mongo/UsersDao.js"
import authService from "../services/auth.js"
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt"
import config from "./config.js"
import CartsDao from "../dao/mongo/CartsDao.js"

// Estrategia local : Registro y Login
// Varios no suelen colocar el registro en passport porque es una Operacion diferente a la autenticación

const LocalStrategy = local.Strategy // Siempre significa username + password. Passport odia el email, pero podemos hacer una logica de negocio entre libreria/desarrollador

const usersService = new UsersDao()
const cartsService = new CartsDao()


const initializeStrategies = () => {

    // Que estrategias colocamos?
    passport.use('register', new LocalStrategy({passReqToCallback: true, usernameField: 'email', session: false}, async (req,email,password,done) => {

        const {
            firstName,
            lastName,
            age,
        } = req.body
    
        if(!firstName || !lastName || !email || !age || !password) return done(null,false,{message: "Incomplete values"})

        const userExists = await usersService.getUserById({email})
        if (userExists) return done(null,false,{message: "User already exists"})
    
        const hashPassword = await authService.createHash(password)
    
        const newUser = {
            firstName,
            lastName,
            email,
            age,
            password: hashPassword,
        }

        //Reviso el cart temporal

        let cart;
        if (req.cookies['cart']){
            cart = req.cookies['cart']
        } else { // Si no existe el cart temporal, lo creo
            cartResult = await cartsService.createCart()
            cart = cartResult._id
        }

        newUser.cart = cart

        const result  = await usersService.createUser(newUser)
        return done(null,result)
    }))

    passport.use('login', new LocalStrategy({usernameField:'email', session: false}, async (email,password,done) => {
        if(!email || !password) return done(null,false,{message: "Incomplete values"})
    
        if (email === config.app.ADMIN_EMAIL && password === config.app.ADMIN_PASS){

            const adminUser = {
                _id: "admin-id",
                firstName: "Admin",
                lastName: "Admin",
                email: "adminCoder@coder.com",
                role: "admin"
            }
       return done(null,adminUser)
        }
    
        const user = await usersService.getUserById({email})
        if (!user) return done(null,false,{message: "Incorrect credentials"})

        const isValidPassword = await authService.validatePassword(password,user.password)
        if (!isValidPassword) return done(null,false,{message: "Incorrect credentials"})

        return done(null,user)
    }))

    passport.use('github', new GithubStrategy({
        clientID: 'Iv1.4ca58e9502b99b00',
        clientSecret: '4508a50d82782bda676ab4a3dd332471c5216d81',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken,refreshToken, profile, done) => {
        const {email,name} = profile._json

        // User validation
        const user = await usersService.getUserById({email})
        if (!user) {
            const newUser = {
                firstName: name,
                email,
                password: ''
            }

            const result = await usersService.createUser(newUser)
            done(null,result)
        } else {
            done(null,user)
        }
    }))


    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([authService.extractAuthToken]),
        secretOrKey: config.jwt.JWT_SECRET
    }, async (payload, done) => {
        return done(null, payload)
    }))

}

//FUTURAS ESTRATEGIAS COMO FACEBOOK, GITHUB, APPLE

    passport.serializeUser((user,done) => {
        return done(null,user._id)
    })

    passport.deserializeUser(async (id,done) => {
        const user = await usersService.getUserById({
            _id: id
        })
        done(null,user)
    })

export default initializeStrategies