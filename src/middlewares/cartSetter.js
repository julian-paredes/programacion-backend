import CartsManager from "../dao/mongo/managers/CartsManager.js"

const cartsService = new CartsManager()

const cartSetter = async (req,res,next) => {
    if (req.user && req.cookies.cart) {
        res.clearCookie('cart')
        return next()
    }
    if (!req.cookies.cart && !req.user) {
        const cart = await cartsService.createCart()
        res.cookie('cart', cart._id.toString())
    }
    next()
}

export default cartSetter