import cartsModel from "./models/carts.js"

export default class CartsDao {

   getCartById = (id, options) => {
      if (options.populate){
         return cartsModel.findOne(id).populate('products.product')
      }
      return cartsModel.findOne({_id: id})
   }

   createCart = () => {
    return cartsModel.create({products: []})
   }

   updateCart = (cid,cart) => {
    return cartsModel.updateOne({_id: cid},{$set: cart})
   }

   updateCarttUnits = (cid,pid, newQuantity) => {
      return cartsModel.updateOne({_id: cid},{$inc: {'products.[product].quantity': Number(newQuantity)}},{arrayFilters:[{"element._id": pid }]})
   }

   deleteProductFromCartById = (cid,pid) => {
    return cartsModel.updateOne({ _id: cid },{$pull: {products: {_id: pid}}})
   }

   deleteAllProductsFromCartById = (cid) => {
      return cartsModel.updateOne({ _id: cid }, { $set: { products: [] } });
    }

   deleteCart = (id) => {
    return cartsModel.deleteOne({_id: id})
   }
}