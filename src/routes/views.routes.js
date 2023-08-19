
const express = require("express");
const ProductManager = require("../ProductManager")
const router = express.Router();

const manager = new ProductManager(__dirname + "/files/products.json");

router.get("/", async (req, res) => {
  const listaProductos = await manager.getProducts();
  res.render("home", { listaProductos });
});

router.get("/realTimeProducts", async (req, res) => {
  const listaProductos = await manager.getProducts();
  res.render("realTimeProducts", { listaProductos });
});

module.exports = router;