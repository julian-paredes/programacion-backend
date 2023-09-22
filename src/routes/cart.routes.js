import { Router } from "express";
import CartsManager from '../dao/mongo/managers/CartsManager.js'
import ProductsManager from "../dao/mongo/managers/ProductsManager.js"

const router = Router()
const cartsService = new CartsManager()
const productsService = new ProductsManager()

router.get("/:cid", async (req, res) => {
  try {
    const {cid} = req.params
    const cart = await cartsService.getCartById({_id: cid},{populate:true});
    if(!cart) return res.status(400).send({status: "error", message: "Cart no found"})
    res.send({status: "success", payload: cart });
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});


router.post("/", async (req, res) => {
  try {
    const cart = await cartsService.createCart()
    res.send({status: "success", payload: cart._id });
  } catch (error) {
    res.status(400).send({ status: "error", message: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const {cid,pid} = req.params
    
    const cart = await cartsService.getCartById({_id: cid},{populate:false})
    if(!cart) return res.status(400).send({status: "error", message: "Cart not found."})

    const productExists = await productsService.getProductsById({_id: pid})
    if(!productExists) return res.status(400).send({status: "error", message: "Product doesn't exist."})

    const productIsInCart = cart.products.find((item) => {
      return item.product.toString() === pid
    })

    if (!productIsInCart) {
      cart.products.push({ product: pid, quantity: 1 })
    } else {
      productIsInCart.quantity++      
    }
    
    await cartsService.updateCart(cid,{products: cart.products});
    res.send({status: "success", payload: "Product added." });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.put("/:cid", async (req,res) => {
  try {
    const {cid} = req.params
    const newProducts = req.body
    const cart = await cartsService.getCartById(cid)
    if (!cart) return res.status(400).send({status: "error", message: "Cart not found"})
    
    await cartsService.updateCart(cid,newProducts);
    res.send({status: "success", payload: "Cart updated." });
  
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
})

router.put("/:cid/products/:pid", async (req,res) => {
   try {
    const {cid,pid} = req.params
    const newQuantity = req.body
    const cart = await cartsService.getCartById(cid)
    if (!cart) return res.status(400).send({status: "error", message: "Cart not found"})    
    const productExists = await productsService.getProductsById(pid)
    if(!productExists) return res.status(400).send({status: "error", message: "Product doesn't exist."})

    const productIsInCart = cart.products.find(({product}) => product.equals(pid))
    if(!productIsInCart) return res.status(400).send({status: "error", message: "Product not found in cart."})

    await cartsService.updateCarttUnits(cid,pid,newQuantity)
    res.send({status: "success", payload: "Quantity updated." });

   } catch (error) {
    res.status(400).send({ message: error.message });

   }
})

router.delete("/:cid", async (req,res) => {
  const cartExists = await cartsService.getCartById(req.params.cid)
  if(!cartExists) return res.status(400).send({status: "error", message: "Product not found."})
  else {
    const result = await cartsService.deleteAllProductsFromCartById(req.params.cid)
    res.send({status: "success", message: "All products have been deleted from cart."})
  }
})

router.delete("/:cid/products/:pid", async (req,res) => {
  try {
    const {cid,pid} = req.params

    const cart = await cartsService.getCartById(cid)
    if(!cart) return res.status(400).send({status: "error", message: "Cart not found."})
  
    const productExists = await productsService.getProductsById(pid)
    if(!productExists) return res.status(400).send({status: "error", message: "Product doesn't exist."})
  
    const productIsInCart = cart.products.find(({product}) => product.equals(pid))
  
    if(!productIsInCart) return res.status(400).send({status: "error", message: "Product not found in cart."})
  
    await cartsService.deleteProductFromCartById(cid,pid)
    res.send({status: "success", message: "Product deleted."})
  
  } catch (error) {
    res.status(400).send({status: "error", message: error.message})
  }
})

export default router