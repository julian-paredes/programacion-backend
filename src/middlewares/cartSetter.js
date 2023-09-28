import CartsManager from "../dao/mongo/managers/CartsManager.js"

const cartsService = new CartsManager()

const cartSetter = async (req,res,next) => {
    if (!req.cookies.cart) {
        const cart = await cartsService.createCart()
        res.cookie('cart', cart._id.toString())
    }
    next()
}

export default cartSetter