
const fs = require('fs')

class ProductManager {
  constructor() {
      this.products = []
      this.path = "./productos.json"
  }

  async addProduct(title,description,price,thumbnail,code,stock) {
    try {
    //Validaciones
    if (!title || !description || !price || !thumbnail || !code || !stock) {
          console.log("Todos los campos son obligatorios")
          return
    }

    if (this.products.some(product => product.code === code)) {
      console.log(`El código del producto ${code} ya fue registrado.`);
      return
    }

let newId = this.products.length === 0 ? 1 : this.products[this.products.length - 1].id + 1

    const product = {
      id: newId,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(product)

      if (this.products.length > 1) {

      } else {
        
      }
      await fs.promises.writeFile(this.path, JSON.stringify(this.products));
      console.log('Productos guardados correctamente');
    } catch (err) {
      console.log('Error al guardar los productos en el archivo');
    }
  }
  
   async getProducts() {
    try {
      const productsData = await fs.promises.readFile(this.path, 'utf8');
      const products = JSON.parse(productsData);
      return products;
    } catch (err) {
      console.log(err);
      console.log('Error al leer los productos del archivo');
      return [];
    }
  }

  async getProductById(id) {
    try {
      const productsData = await fs.promises.readFile(this.path, 'utf8');
      const products = JSON.parse(productsData);
      console.log("id",products);
      const product = products.find((product) => product.id === JSON.parse(id));
      console.log(product);
      if (product) {
        return product;
      } else {
        console.log(`No existe ningún producto con el ID ${id}`);
        return null;
      }
    } catch (err) {
      console.log('Error al leer los productos del archivo');
      return null;
    }
  }

  async updateProduct(id, fieldsToUpdate) {
    try {
      const productsData = await fs.promises.readFile(this.path, 'utf8');
      const products = JSON.parse(productsData);
      const product = products.find((product) => product.id === id);
      if (product) {
        Object.assign(product, fieldsToUpdate);
        await fs.promises.writeFile(this.path, JSON.stringify(products));
        console.log('Producto actualizado correctamente');
      } else {
        console.log(`No existe ningún producto con el ID ${id}`);
      }
    } catch (err) {
      console.log('Error al leer o escribir los productos del archivo');
    }
  }

  async deleteProduct(id) {
    try {
      const productsData = await fs.promises.readFile(this.path, 'utf8');
      const products = JSON.parse(productsData);
      const productIndex = products.findIndex((product) => product.id === id);
      if (productIndex !== -1) {
        products.splice(productIndex, 1);
        await fs.promises.writeFile(this.path, JSON.stringify(products));
        console.log('Producto eliminado correctamente');
      } else {
        console.log(`No existe ningún producto con el ID ${id}`);
      }
    } catch (err) {
      console.log('Error al leer o escribir los productos del archivo');
    }
  }
}

module.exports = ProductManager;
