const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
// Es una funcion que recibe como parametro un resultado y lo convierte en miles con el punto
const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	root: (req, res) => {
		let inSale = products.filter(cadaProducto=>{
			return cadaProducto.category == "in-sale";
		});
		let visited = products.filter(cadaProducto=>{
			return cadaProducto.category == "visited";
		});
		res.render('index',{
			inSale,
			visited,
			toThousand
		})
	},
	search: (req, res) => {
		const result = products.filter(cadaPraducto=>{
			return cadaPraducto.name.toLowerCase().includes(req.query.keywords.toLowerCase().trim());
		}); //trim() : borra todos los espacios adelante y detras de la palabra
		
		//donde se muestra los resultados de busqueda
		res.render('results',{
			result,
			search: req.query.keywords, //te trae la palabra exacta que buscaste
			toThousand
		})
	},
};

module.exports = controller;
