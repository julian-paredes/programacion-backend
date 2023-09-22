import express from "express"
import mongoose from "mongoose";
import Handlebars from "express-handlebars"
import session from "express-session";
import MongoStore from 'connect-mongo'
import passport from "passport";

import productsRouter from "./routes/product.routes.js"
import viewRouter from "./routes/views.routes.js"
import cartsRouter from "./routes/cart.routes.js"
import sessionsRouter from "./routes/sessions.routes.js"
import loginJWTRouter from "./routes/pruebaJWT/loginJWT.js"
import __dirname from "./utils.js"
import initializeStrategies from "./config/passport.config.js";


const app = express()
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
const connection = mongoose.connect("mongodb+srv://julikmet24:123@cluster-jp.2shwvcf.mongodb.net/musicStore?retryWrites=true&w=majority")

app.use(session({
    store: MongoStore.create({
        mongoUrl:"mongodb+srv://julikmet24:123@cluster-jp.2shwvcf.mongodb.net/musicStore?retryWrites=true&w=majority",
        ttl: 60
    }),
    resave: false,
    saveUninitialized: false,
    secret:"musicStore"
}))

initializeStrategies()
app.use(passport.initialize())

app.engine('handlebars', Handlebars.engine())
app.set('views',`${__dirname}/views`)
app.set('view engine', 'handlebars')

app.use(express.static(`${__dirname}/public`))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/', viewRouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/api/sessions', loginJWTRouter)