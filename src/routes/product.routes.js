
const express = require("express");
const ProductManager = require("../ProductManager")
const manager = new ProductManager();
const router = express.Router();

//endpoint "/products"
router.get("/", async (req, res) => {
    try {
      let prods = await manager.getProducts()
      if (req.query.limit) {
        let limiteds = prods.slice(0, req.query.limit);
        res.send(limiteds);
      } else {
        res.send(prods);
      }
    } catch (error) {
      res.json({ error: error });
    }
  });
  
  //endpoint product by id
  router.get("/:pid", async (req, res) => {
    let {pid} = req.params;
    try {
      let product = await manager.getProductById(pid);
      res.json(product);
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
      const product = await manager.addProduct(
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail
      );
      res.send(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  router.put("/:pid", async (req, res) => {
    try {
      let productId = req.params.pid;
      let result = await manager.updateProduct(productId, req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  });
  
  router.delete("/:pid", async (req, res) => {
    try {
      let productId = req.params.pid;
      let result = await productManager.deleteProduct(productId);
      res.json({ success: result });
    } catch (error) {
      res.json({ error: error.message });
    }
  });

  module.exports = router;
  
  