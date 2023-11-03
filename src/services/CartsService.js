
export default class CartsService {
    constructor(manager) {
        this.manager = manager
    }

    getCartById = (id,option) => {
        return this.manager.getCartById(id,option)
    }

    createCart = () => {
        return this.manager.createCart()
    }

    updateCart = (cid,cart) => {
        return this.manager.updateCart(cid,cart)
    }

    updateCarttUnits = (cid,pid, newQuantity) => {
        return this.manager.updateCarttUnits(cid,pid,newQuantity)
    }

    deleteProductFromCartById = (cid,pid) => {
        return this.manager.deleteProductFromCartById(cid,pid)
    }

    deleteAllProductsFromCartById = (cid) => {
        return this.manager.deleteAllProductsFromCartById(cid)
    }

    deleteCart = (id) => {
        return this.manager.deleteCart(id)
    }
}