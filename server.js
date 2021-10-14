
const express = require("express");
const fs = require('fs/promises');
const app = express();
const PORT = 8080;
class Contenedor {
	constructor(nombreArchivo) {
		this.nombreArchivo = nombreArchivo;
		this.content = [];
	};

	async save(producto) {
		try {
			this.content.push({
				title: producto.title,
				price: producto.price,
				thumbnail: producto.thumbnail,
				id: this.content.length + 1,
			});
			await fs.writeFile(this.nombreArchivo, JSON.stringify(this.content, null, 2));
            return
		} catch (error) {
			console.log('No se pudo agregar un producto');
            throw error
		}
	};

    async getById(id){
		try {
			const data = await fs.readFile(this.nombreArchivo, 'utf-8');
            const dataParse = JSON.parse(data)
			const producto = dataParse.find(prod => prod.id === id);
			if(producto){
				console.log(`producto con el id ${id}:`);
				console.log(producto)
                return producto
			} else
			if(!producto){
				console.log(`el producto con el id ${id} no existe`);
			}
			
		} catch (error) {
			console.log(`No se pudo encontrar producto con el id ${id}`);
            throw error
		}
    };

	//borrar por id
	async deleteById(id){
		try {
			const oldData = await fs.readFile(this.nombreArchivo, 'utf-8');
			const dataParse = JSON.parse(oldData);
			const producto = dataParse.find(prod => prod.id === id);
			if(producto.id){
			const newData = dataParse.filter(prod => prod.id !== id)
			await fs.writeFile(this.nombreArchivo, JSON.stringify(newData, null, 2));
			const data = await fs.readFile(this.nombreArchivo, 'utf-8');
			 return data
			} else
			 if (!producto.id){
				return console.log('error');
			}
		} catch (error) {
			console.log(`No se pudo borrar el producto con el id ${id}`);
            throw error
		}
	};

	getAll() {
		try {
			const data = fs.readFile(this.nombreArchivo, 'UTF-8');
            return data
		} catch (error) {
			console.log('No se pudo leer el archivo');
            throw error
		}
	};
};

const server = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
server.on("error", (error) => console.log(error));

const file = "productos.txt";

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