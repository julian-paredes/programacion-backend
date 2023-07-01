
class ProductManager {
  constructor() {
      this.products = []
  }

  addProduct(title,description,price,thumbnail,code,stock) {

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
  }
  
  getProducts(){
    return this.products
  }

  getProductById(id) {
    let productById = this.products.find((product) => product.id === id)
    if (!productById) return console.log(`No existe ningun producto con el ID ${id}`)
    else return productById    
  }
}


let instancia = new ProductManager()

instancia.addProduct(
  title = "Producto 1", description = "Descripcion 1", price = 1000, thumbnail = "imagen.jpg", code = "1234AB",stock = 10
)

instancia.addProduct(
  title = "Producto 2", description = "Descripcion 2", price = 2000, thumbnail = "imagen.jpg", code = "1234AA",stock = 10
)

instancia.addProduct(
  title = "Producto 3", description = "Descripcion 3", price = 3000, thumbnail = "imagen.jpg", code = "1234AC",stock = 10
)

instancia.addProduct(
  title = "Producto 4", description = "Descripcion 4", price = 4000, thumbnail = "imagen.jpg", code = "1234AD",stock = 10
)

console.log("Productos -> ", instancia.getProducts());
console.log("Producto por ID", instancia.getProductById(2));
console.log("Producto por ID", instancia.getProductById(3));