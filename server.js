const express = require("express");
const fs = require('fs');
const app = express();
const PORT = 8080;

class Contenedor {
  constructor(nombreArchivo) {
    this.file = nombreArchivo;
  }
  save(obj) {
    try {
      const data = JSON.parse(fs.readFileSync(this.file, "utf-8"));
      if (data.length === 0) {
        obj.id = 1;
        fs.appendFileSync(this.file, JSON.stringify(obj));
        return obj.id;
      } else {
        let lastIdCreated = data[data.length - 1].id;
        obj.id = lastIdCreated + 1;
        data.push(obj);
        fs.writeFileSync(this.file, JSON.stringify(data), "UTF-8");
        return obj.id;
      }
    } catch (error) {
      if (error.code === "ENOENT") {
        try {
          obj.id = 1;
          const newObjectList = [obj];
          fs.writeFileSync(
            this.file,
            JSON.stringify(newObjectList),
            "UTF-8"
          );
          return obj.id;
        } catch (error) {
          throw error;
        }
      }
      throw error;
    }
  }
  getById(id) {
    try {
      const data = JSON.parse(fs.readFileSync(this.file, "UTF-8")).filter(
        (item) => item.id === id
      );
      if (data.length === 0) {
        return null;
      } else {
        return data;
      }
    } catch (error) {
      throw error;
    }
  }

  getAll() {
    try {
      const data = JSON.parse(fs.readFileSync(this.file, "UTF-8"));
      return data;
    } catch (error) {
      throw error;
    }
  }

  deleteById(id) {
    try {
        const oldData = fs.readFile(this.nombreArchivo, 'utf-8');
        const dataParse = JSON.parse(oldData);
        const producto = dataParse.find(prod => prod.id === id);
        if(producto.id){
        const newData = dataParse.filter(prod => prod.id !== id)
        fs.writeFile(this.nombreArchivo, JSON.stringify(newData, null, 2));
        const data = fs.readFile(this.nombreArchivo, 'utf-8');
         return console.log(data)
        } else
         if (!producto.id){
            return console.log('error');
        }
    } catch (error) {
        throw error;
    }
  }
  deleteAll() {
    try {
        fs.truncate(this.nombreArchivo,0);
    } catch (error) {
        throw error;
    }
  }
};

const server = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
server.on("error", (error) => console.log(error));

const file = "./productos.txt";
const productos = new Contenedor(file);

function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

app.get("/productos", (req, res) => {
  const products = productos.getAll();
  res.status(200).send(products);
});

app.get("/productoRandom", (req, res) => {
    let todosLosProductos = productos.getAll();
    const randomIndex = getRandomNum(0, todosLosProductos.length++);
    const productoRandom = todosLosProductos[randomIndex];
    res.status(200).send(productoRandom)
});