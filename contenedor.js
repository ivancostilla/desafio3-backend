const fs = require('fs');

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
			await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(this.content, null, 2));
            return
		} catch (error) {
			console.log('No se pudo agregar un producto');
            throw error
		}
	};

    async getById(id){
		try {
			const data = await fs.promises.readFile(this.nombreArchivo, 'utf-8');
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
			const oldData = await fs.promises.readFile(this.nombreArchivo, 'utf-8');
			const dataParse = JSON.parse(oldData);
			const producto = dataParse.find(prod => prod.id === id);
			if(producto.id){
			const newData = dataParse.filter(prod => prod.id !== id)
			await fs.writeFile(this.nombreArchivo, JSON.stringify(newData, null, 2));
			const data = await fs.promises.readFile(this.nombreArchivo, 'utf-8');
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
			const data = fs.promises.readFile(this.nombreArchivo, 'UTF-8');
            return data
		} catch (error) {
			console.log('No se pudo leer el archivo');
            throw error
		}
	};
};
module.exports = Contenedor