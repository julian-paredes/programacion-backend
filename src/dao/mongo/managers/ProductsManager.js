import productsModel from "../models/products.js";

export default class ProductsManager {

    getProducts = (page,limit) => {
        return productsModel.paginate({},{page,limit,lean:true})
    }

    getProductsBy = (params) => {
        return productsModel.findOne(params).lean()
    }

    createProduct = (product) => {
        return productsModel.create(product)
    }

    updateProduct = (id,product) => {
        return productsModel.updateOne({_id: id},{$set: product})
    }

    deleteProduct = (id) => {
        return productsModel.deleteOne({_id: id})
    }
}