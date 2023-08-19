
const express = require("express");
const CartManager = require("../CartManager");
const cartsRouter = new CartManager();
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const cart = await cartsRouter.createCart();
    res.send({ carts: cart });
  } catch (error) {
    res.status(400).send({ status: "error", message: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cartId = await cartsRouter.getCartById(req.params.cid);
    res.send({ cart: cartId });
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartProduct = await cartsRouter.addProductToCart(
      req.params.cid,
      req.params.pid
    );
    res.send({ carts: cartProduct });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

module.exports = router;