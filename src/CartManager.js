
const fs = require("fs");

class CartManager {
  constructor() {
    this.cartsArray = [];
    this.path = "./carts.json";
  }

  async createCart() {
    let cart = {};
    let allCart = JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
    this.cartsArray = allCart;
    if (allCart.length == 0) {
      cart.id = 1;
    } else {
      cart.id = this.cartsArray[this.cartsArray.length - 1].id + 1;
    }
    cart.products = [];
    this.cartsArray.push(cart);
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(this.cartsArray),
      "utf-8"
    );
    return this.cartsArray;
  }

  async getCartById(cid) {
    const allCart = JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
    const cartId = allCart.find((cart) => cart.id == cid);
    if (!cartId) {
      throw new Error(`No se encuentra carrito con id: ${cid}`);
    } else {
      return cartId;
    }
  }

  async addProductToCart(cid, pid) {
    const allCart = JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
    const selectedCart = allCart.find((cart) => cart.id == cid);
    if (!selectedCart) {
      throw new Error(`Cart ID: ${cid} no existe`);
    } else {
      const selectedProduct = selectedCart.products.find(
        (product) => product.product === pid
      );
      if (!selectedProduct) {
        selectedCart.products.push({ product: pid, quantity: 1 });
      } else {
        selectedProduct.quantity++;
      }
      await fs.promises.writeFile(this.path, JSON.stringify(allCart));
      return allCart;
    }
  }
}

module.exports = CartManager;