
export default class ProductsService {
    constructor(manager){
        this.manager = manager
    }

    getProducts = () => {
        return this.manager.getProducts()
    }

    getProductsById = (pid) => {
        return this.manager.getProductsById(pid)
    }

    createProduct = () => {
        return this.manager.createProduct()
    }

    updateProduct = (id,product) => {
        return this.manager.updateProduct(id,product)
    }

    deleteProduct = (id) => {
        return this.manager.deleteProduct(id)
    }
}