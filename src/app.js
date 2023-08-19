
const express = require("express");
const app = express();
const productRoute = require("./routes/product.routes.js");
const cartRoute = require("./routes/cart.routes.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 8080;

app.use("/api/products", productRoute );
app.use("/api/carts", cartRoute);

app.listen(port, () =>
  console.log(`Server corriendo en http://localhost:${port}`)
);