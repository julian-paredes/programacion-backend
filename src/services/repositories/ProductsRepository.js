
export default class ProductsRepository {
    constructor(dao){
        this.dao = dao
    }

    getProducts = () => {
        return this.dao.getProducts()
    }

    getProductsById = (pid) => {
        return this.dao.getProductsById(pid)
    }

    createProduct = (newProduct) => {
        return this.dao.createProduct(newProduct)
    }

    updateProduct = (id,product) => {
        return this.dao.updateProduct(id,product)
    }

    deleteProduct = (id) => {
        return this.dao.deleteProduct(id)
    }
}