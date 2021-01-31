const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	root: (req, res) => {
		res.render('products',{
			products,
			toThousand
		})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		let productID = products.find(cadaProducto=>{
			return cadaProducto.id == +req.params.productId;
		})
		res.render('detail',{
			productID,
			toThousand
		})
	},

	// Create - Form to create
	create: (req, res) => { //solo muestra la vista del formulario
		res.render('product-create-form')
	},
	
	// Create -  Method to store
	store: (req, res) => {
		let lastId = 1;
		products.forEach(cadaProducto => {
			/*Si el id del json es mayor a 1(lastid), el 1 pasa a a valer el id del json.  */
			if(cadaProducto.id > lastId){
				lasId = cadaProducto.id;
			}
		});
		const {name,price,discount,category,description} = req.body;

		const product ={
			id : Number(lastId + 1),
			//no le asignamos  el otro valor xq como tiene el mismo nombre seria lo mismo
			name,
			price,
			discount,
			category,
			description
		}
		products.push(product);
		fs.writeFileSync(productsFilePath,JSON.stringify(products),'utf-8');
		res.redirect('/products');
	},

	// Update - Form to edit
	edit: (req, res) => {
		let productID = products.find(cadaProducto=>{
			return cadaProducto.id === +req.params.productId;
		})
		res.render('product-edit-form',{
			productID
		})
	},
	// Update - Method to update
	update: (req, res) => { //captura todos los datos que esta en el formy los guarda
		const {name,price,discount,category,description} = req.body;

		products.forEach(cadaProducto => {
			if(cadaProducto.id === +req.params.productId){
				cadaProducto.id = +req.params.productId, //hay que sobreescribir el id xq sino es nulo y no lo agrega
				cadaProducto.name = name,
				cadaProducto.price = price,
				cadaProducto.discount = discount,
				cadaProducto.category = category,
				cadaProducto.description = description
			}
		});

		fs.writeFileSync(productsFilePath,JSON.stringify(products),'utf-8');
		res.redirect('/products');
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		products.forEach(cadaProducto=>{
			if(cadaProducto.id === +req.params.productId){
				//buscala posicion  del json el id por paramaetro
				let productDelete = products.indexOf(cadaProducto);
				//tiene la posicion y lo elimina
				products.splice(productDelete,1);
			}
		})
		fs.writeFileSync(productsFilePath,JSON.stringify(products),'utf-8');
		res.redirect('/products');
	}
};

module.exports = controller;