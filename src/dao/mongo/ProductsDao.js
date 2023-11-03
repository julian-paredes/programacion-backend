import productsModel from "./models/products.js";

export default class ProductsDao {

    getProducts = () => {
        return productsModel.find().lean()
    }

    getProductsById = (pid) => {
        return productsModel.findOne({_id: pid}).lean()
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

    paginateProducts = (params, paginateOptions) => {
        return productsModel.paginate(params,paginateOptions)
    }
}