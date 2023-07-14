
const fs = require('fs')

class ProductManager {
  constructor(path) {
      this.products = []
      this.path = path
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
      console.log('Error al leer los productos del archivo');
      return [];
    }
  }

  async getProductById(id) {
    try {
      const productsData = await fs.promises.readFile(this.path, 'utf8');
      const products = JSON.parse(productsData);
      const product = products.find((product) => product.id === id);
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


const instancia = new ProductManager('./productos.json');

const llamadaAsincrónica =  async () => {
  await instancia.addProduct('Producto 1', 'Descripción 1', 1000, 'imagen.jpg', '1234AB', 10);
  await instancia.addProduct('Producto 2', 'Descripción 2', 2000, 'imagen.jpg', '1234AA', 10);
  await instancia.addProduct('Producto 3', 'Descripción 3', 3000, 'imagen.jpg', '1234AC', 10);
  await instancia.addProduct('Producto 4', 'Descripción 4', 4000, 'imagen.jpg', '1234AD', 10);

  const products = await instancia.getProducts();
  console.log('Productos:', products);

  const product = await instancia.getProductById(2);
  console.log('Producto por ID:', product);

  await instancia.updateProduct(1, { title: 'Nuevo Producto 1', price: 2000 });
  await instancia.deleteProduct(2);

  const updatedProducts = await instancia.getProducts();
  console.log('Productos actualizados:', updatedProducts);
}

llamadaAsincrónica();