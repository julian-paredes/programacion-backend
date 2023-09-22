import passport from "passport"
import local from "passport-local"
import GithubStrategy from "passport-github2"
import UsersManager from "../dao/mongo/managers/UsersManager.js"
import authService from "../services/auth.js"

// Estrategia local : Registro y Login
// Varios no suelen colocar el registro en passport porque es una Operacion diferente a la autenticación

const LocalStrategy = local.Strategy // Siempre significa username + password. Passport odia el email, pero podemos hacer una logica de negocio entre libreria/desarrollador

const usersService = new UsersManager()


const initializeStrategies = () => {

    // Que estrategias colocamos?
    passport.use('register', new LocalStrategy({passReqToCallback: true, usernameField: 'email'}, async (req,email,password,done) => {

        const {
            firstName,
            lastName,
            age,
        } = req.body
    
        if(!firstName || !lastName || !email || !age || !password) return done(null,false,{message: "Incomplete values"})

        //AGREGAR Validacion de que ya esta registrado

        // return done(null,false,{message: "User already exists"})
    
        const hashPassword = await authService.createHash(password)
    
        const newUser = {
            firstName,
            lastName,
            email,
            age,
            password: hashPassword
        }
        const result  = await usersService.createUser(newUser)
        done(null,result)
    }))

    passport.use('login', new LocalStrategy({usernameField:'email'}, async (email,password,done) => {
        if(!email || !password) return done(null,false,{message: "Incomplete values"})
    
        if (email === "adminCoder@coder.com" && password === "adminCod3r123"){

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

        done(null,user)
    }))
}

//FUTURAS ESTRATEGIAS COMO FACEBOOK, GITHUB, APPLE

    passport.use('github', new GithubStrategy({
        clientID: 'Iv1.4ca58e9502b99b00',
        clientSecret: '4508a50d82782bda676ab4a3dd332471c5216d81',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken,refreshToken, profile, done) => {
        console.log(profile)
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