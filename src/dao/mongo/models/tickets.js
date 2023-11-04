import mongoose from "mongoose";

const collection = "Tickets"

const cartsSubSchema = new mongoose.Schema({
    cart: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Carts"
    }
})

const schema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    purchase_datetime: {
        type: Date,
        unique: true,
        default: Date.now()
    },
    amount: {
        type: Number,
        required: true,
    },
    purchaser: {
        type: String,
        required: true
    },

    carts: {
        type: [cartsSubSchema]
    }

}, {timestamps: true})

schema.pre(["find", "findOne"], function () {
    this.populate("carts.cart");
  });

const ticketsModel = mongoose.model(collection,schema)

export default ticketsModel