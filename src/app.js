const { Server } = require("socket.io");
const handlebars = require("express-handlebars");
const express = require("express");
const app = express();
const productRoute = require("./routes/product.routes.js");
const cartRoute = require("./routes/cart.routes.js");
const viewsRoute = require("./routes/views.routes.js");
const ProductManager = require("./ProductManager.js")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
const port = 8080;

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

app.use("/api/products", productRoute );
app.use("/api/carts", cartRoute);
app.use("/", viewsRoute);

const manager = new ProductManager(__dirname + "../productos.json")

const httpServer = app.listen(port, () =>
  console.log(`Server corriendo en http://localhost:${port}`)
);

const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
  console.log("Cliente conectado con id: ", socket.id);

  const listProducts = await manager.getProducts({});
  socketServer.emit("sendProducts", listProducts);

  socket.on("addProduct", async (obj) => {
    await manager.addProduct(obj);
    const listProducts = await manager.getProducts({});
    socketServer.emit("sendProducts", listProducts);
  });

  socket.on("deleteProduct", async (id) => {
    await manager.deleteProduct(id);
    const listProducts = await manager.getProducts({});
    socketServer.emit("sendProducts", listProducts);
  });
  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});