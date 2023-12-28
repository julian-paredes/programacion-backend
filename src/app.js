import express from "express"
import mongoose from "mongoose";
import Handlebars from "express-handlebars"
import session from "express-session";
import MongoStore from 'connect-mongo'
import cookieParser from "cookie-parser";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUIExpress from "swagger-ui-express";

import productsRouter from "./routes/newProduct.routes.js"
import viewRouter from "./routes/newViews.routes.js"
import cartsRouter from "./routes/newCart.routes.js"
import sessionsRouter from "./routes/newSessions.routes.js"
import usersRouter from "./routes/users.routes.js"
import __dirname from "./utils.js"
import initializeStrategies from "./config/passport.config.js";
import config from "./config/config.js";
import attachLogger from "./middlewares/attachLogger.js";


const app = express()
const server = app.listen(config.app.PORT, () => console.log(`Listening on port ${config.app.PORT}`))

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

const connection = mongoose.connect(config.mongo.MONGO_URL)

const swaggerSpecOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Music Store API",
            version: "1.0.0",
            description: "Music Store API Information",
        },
    },
    apis: [`${__dirname}/docs/**/*.yml`],
}

const swaggerSpec = swaggerJSDoc(swaggerSpecOptions)
app.use("/apidocs", swaggerUIExpress.serve, swaggerUIExpress.setup(swaggerSpec))

app.engine('handlebars', Handlebars.engine())
app.set('views',`${__dirname}/views`)
app.set('view engine', 'handlebars')

app.use(express.static(`${__dirname}/public`))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use(attachLogger)

app.use('/', viewRouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/api/users', usersRouter)

app.get('/loggerTest', (req,res) => {
    req.logger.error('ERROR')
    req.logger.fatal('FATAL ERROR')
})
