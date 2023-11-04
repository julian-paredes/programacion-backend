
export default class CartsRepository {
    constructor(dao) {
        this.dao = dao
    }

    getCartById = (id,option) => {
        return this.dao.getCartById(id,option)
    }

    createCart = () => {
        return this.dao.createCart()
    }

    updateCart = (cid,cart) => {
        return this.dao.updateCart(cid,cart)
    }

    updateCarttUnits = (cid,pid, newQuantity) => {
        return this.dao.updateCarttUnits(cid,pid,newQuantity)
    }

    deleteProductFromCartById = (cid,pid) => {
        return this.dao.deleteProductFromCartById(cid,pid)
    }

    deleteAllProductsFromCartById = (cid) => {
        return this.dao.deleteAllProductsFromCartById(cid)
    }

    deleteCart = (id) => {
        return this.dao.deleteCart(id)
    }
}