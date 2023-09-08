import mongoose from "mongoose";

const collection = "Carts"

const schema = new mongoose.Schema({
    
})

const cartsModel = mongoose.model(collection,schema)

export default cartsModel