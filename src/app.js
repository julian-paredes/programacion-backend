const ProductManager = require("./ProductManager")

const manager = new ProductManager('./productos.json');
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 8080;

//endpoint "/products"
app.get("/products", async (req, res) => {
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
app.get("/products/:pid", async (req, res) => {
  let {pid} = req.params;
  try {
    let product = await manager.getProductById(pid);
    res.json(product);
  } catch (error) {
    res.json({ error: error });
  }
});

app.listen(port, () =>
  console.log(`Server corriendo en http://localhost:${port}`)
);