
import { Router } from "express";
import ProductsManager from "../dao/mongo/managers/ProductsManager.js";

const router = Router()
const productsService = new ProductsManager()

//endpoint "/products"
router.get("/", async (req, res) => {
    try {

    const products = await productsService.getProducts()
    res.send({status: "success", payload: products })
    } catch (error) {
      res.json({ error: error });
    }
  });
  
  //endpoint product by id
  router.get("/:pid", async (req, res) => {
    try {
      const {pid} = req.params;
      const product = await productsService.getProductsById(pid)
      res.json({status: "success", payload: product});
    } catch (error) {
      res.json({ error: error });
    }
  });

  router.post("/", async (req, res) => {
    try {
      const {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail,
      } = req.body;

      if (!title || !description || !code || !price || !stock || !category) {
        res.status(400).send({status: "error", message: "Incomplete values" })
      }
      const newProduct = {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail,
      }
      const products = await productsService.getProducts()

      const codeNotAvailable = products.find(product => product.code === code)

      if (codeNotAvailable) {
        return res.status(400).send({status: "error", message: "Product code has already been used"})
      }
      const result = await productsService.createProduct(newProduct)
      res.send({status: "success", message: "Product added", payload: result._id});
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  });
  
  router.put('/:pid', async (req,res) => {
    try {
      const id = req.params.pid
      const {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,    
      } = req.body;

      const updateProduct = {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,   
      }

      const product = await productsService.getProductsById({_id: id})
      if (!product) return res.status(404).send({status: "error", error: "Videojuego no existe"})
      const result = await productsService.updateProduct(id, updateProduct)
      res.send({status: "success", message: "Product updated" })
      } catch (error) {
      res.json({ error: error.message });     
      }
})
  
  router.delete("/:pid",async (req,res) => {
    try {
      const id = req.params.pid
      const result = await productsService.deleteProduct(id)
      res.send({status: "success", message: "Product deleted"})
    } catch (error) {
      res.json({ error: error.message });     
    }
})

  
  export default router