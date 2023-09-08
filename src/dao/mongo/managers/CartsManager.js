import cartsModel from "../models/carts.js"

export default class CartsManager {

   getCartById = (params) => {
    return cartsModel.findOne(params).lean()
   }
   
   createCart = (cart) => {
    return cartsModel.create(cart)
   }

   updateCart = (id,cart) => {
    return cartsModel.updateOne({_id: id},{$set: cart})
   }

   deleteProductFromCartById = (id,productId) => {
    return cartsModel.deleteOne({_id: id})
   }

   deleteCart = (id) => {
    return cartsModel.deleteOne({_id: id})
   }
}