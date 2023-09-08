import express from "express"
import mongoose from "mongoose";
import productsRouter from "./routes/product.routes.js"
import viewRouter from "./routes/views.routes.js"
import cartsRouter from "./routes/cart.routes.js"
import __dirname from "./utils.js"
import Handlebars from "express-handlebars"

const app = express()
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
const connection = mongoose.connect("mongodb+srv://julikmet24:123@cluster-jp.2shwvcf.mongodb.net/musicStore?retryWrites=true&w=majority")

app.engine('handlebars', Handlebars.engine())
app.set('views',`${__dirname}/views`)
app.set('view engine', 'handlebars')

app.use(express.static(`${__dirname}/public`))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/', viewRouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)