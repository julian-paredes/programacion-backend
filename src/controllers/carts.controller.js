import DMailTemplates from "../constants/DMailTemplates.js";
import { cartsService, productsService, ticketsService } from "../services/index.js";
import MailerService from "../services/mailerService.js";

const getCartById = async (req, res) => {
    try {
      const {cid} = req.params
      const cart = await cartsService.getCartById({_id: cid},{populate:true});
      if(!cart) return res.status(400).send({status: "error", message: "Cart no found"})
      res.send({status: "success", payload: cart });
    } catch (error) {
      res.status(404).send({ message: error.message });
    }
  }

const createCart = async (req, res) => {
    try {
      const cart = await cartsService.createCart()
      res.send({status: "success", payload: cart._id });
    } catch (error) {
      res.status(400).send({ status: "error", message: error.message });
    }
  }

const updateCart = async (req, res) => {
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
      res.send({status: "success", payload: "Product added to cart." });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  }

const addProductToCart = async (req, res) => {
    try {
      const {pid} = req.params
      
      const cart = await cartsService.getCartById({_id: req.user.cart},{populate:false})
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
      
      await cartsService.updateCart(req.user.cart,{products: cart.products});
      res.send({status: "success", payload: "Product added to cart." });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  }

const addProductToCartInBody = async (req,res) => {
    try {
      const {cid} = req.params
      const newProducts = req.body
      const cart = await cartsService.getCartById({_id: cid},{populate:false})
      if (!cart) return res.status(400).send({status: "error", message: "Cart not found"})
      
      await cartsService.updateCart(cid,newProducts);
      res.send({status: "success", payload: "Cart updated." });
    
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  }
  
const updateCarttUnits = async (req,res) => {
    try {
     const {cid,pid} = req.params
     const newQuantity = req.body
     const cart = await cartsService.getCartById({_id: cid},{populate:false})
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
 }

const deleteProductFromCartById = async (req,res) => {
    try {
      const {cid,pid} = req.params
  
      const cart = await cartsService.getCartById({_id: cid},{populate:false})
      if(!cart) return res.status(400).send({status: "error", message: "Cart not found."})
    
      const productExists = await productsService.getProductsById(pid)
      if(!productExists) return res.status(400).send({status: "error", message: "Product doesn't exist."})
    
      const productIsInCart = cart.products.find(({product}) => product.equals(pid))
  
      if(!productIsInCart) return res.status(400).send({status: "error", message: "Product not found in cart."})
    
      const result = await cartsService.deleteProductFromCartById(cid,pid)
      res.send({status: "success", message: "Product deleted."})
    
    } catch (error) {
      res.status(400).send({status: "error", message: error.message})
    }
  }

const deleteAllProductsFromCartById = async (req,res) => {
  try {
    const cartExists = await cartsService.getCartById({_id: cid},{populate:false})
    if(!cartExists) return res.status(400).send({status: "error", message: "Product not found."})
    else {
      const result = await cartsService.deleteAllProductsFromCartById(req.params.cid)
      res.send({status: "success", message: "All products have been deleted from cart."})
    }
  } catch (error) {
    res.status(400).send({status: "error", message: error.message})
  }
}

const purchaseCart = async (req,res) => {
  try {
    const {cid} = req.params

    const cart = await cartsService.getCartById({_id: cid},{populate:true})
    if(!cart) return res.status(400).send({status: "error", message: "Cart not found."})

    const productosProcesados = []
    let sumTotal = 0

    for (const item of cart.products) {
      let product = item.product
      let quantity = item.quantity
      let stock = product.stock
      let amount = product.price

      if (quantity <= stock) {
        let newStock = stock - quantity

        const stockModified = await productsService.updateProduct({_id: product._id},{stock: newStock})
        if (!stockModified) res.status(400).send({status: "error", message: error.message})

        productosProcesados.push(item);
        console.log(`Producto ${product.code} procesado en compra`);

        sumTotal += amount

      } else {
        console.log(`No podes comprar el producto ${product.code} debido a la falta de stock suficiente.`);
      }
    }
    const codeTicket = Date.now().toString(15);

    console.log(req.user)

    const newTicket = {
      code: codeTicket,
      amount: sumTotal,
      purchaser: req.user.email,
      purchaser_datetime: new Date().toLocaleDateString(),
      products: productosProcesados,
    }

    console.log(newTicket);

    const ticketResult = await ticketsService.createTicket(newTicket)

    if (ticketResult) {

      const payload = {
        name: req.user.name,
        newTicket,
      };
  
      res.status(200).send({status: "success", message: "Your order has been purchased!", payload: payload})

    }

    const mailerService = new MailerService()
    
    const result = await mailerService.sendMail(
      [req.user.email],
      DMailTemplates.PURCHASE,
      {
        name: req.user.name,
        ticket: newTicket.code,
        date: newTicket.purchaser_datetime,
      }
    );

  } catch (error) {
    res.status(400).send({status: "error", message: error.message})
  }
}



export default {
    getCartById,
    createCart,
    updateCart,
    addProductToCart,
    updateCarttUnits,
    addProductToCartInBody,
    deleteProductFromCartById,
    deleteAllProductsFromCartById,
    purchaseCart
}