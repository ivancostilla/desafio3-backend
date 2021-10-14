
const express = require("express");
const Contenedor = require('./contenedor.js')
const app = express();
const PORT = 8080;

const server = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
server.on("error", (error) => console.log(error));

const file = "./productos.txt";

const productos = new Contenedor(file);

function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
app.get("/", (req, res) => {
    res.status(200).send('<a href="/productos">Productos</a><br/><a href="/productoRandom">Producto Random</a>')
  });

app.get("/productos", async(req, res) => {
  const products = await productos.getAll();
  res.status(200).send(JSON.parse(products))
});

app.get("/productoRandom", async(req, res) => {
    let todosLosProductos = await productos.getAll();
    const randomIndex = getRandomNum(0, JSON.parse(todosLosProductos).length++);
    const productoRandom = JSON.parse(todosLosProductos)[randomIndex];
    res.status(200).send(productoRandom)
});