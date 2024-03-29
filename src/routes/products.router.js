const express = require("express");
const router = express.Router();
const ProductModel = require("../dao/models/product.model.js");
const ProductManager = require("../dao/db/product-manager-db.js");
const prodManager  = new ProductManager();

//GET
router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const products = await prodManager.getProducts({
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query,
        });

        res.json({
            status: 'success',
            payload: products,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null,
        });

    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({
            status: 'error',
            error: "Error interno del servidor"
        });
    }
});


// GET: Para obtener un producto por ID
router.get('/:pid', async (req, res) => {

    try {
        let pid = req.params.pid;
        const prod = await prodManager.getProductById(pid);
        
        if (prod) {
            res.json(prod)
        } else {
            res.status(404).json({msg: "Not Found"})
        }

    } catch (error) {
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
});

// POST: Para agregar producto
router.post('/', async (req, res) => {

    const newProd = req.body;

    try {

        await prodManager.addProduct(newProd);
        res.status(201).json({ message: "Producto agregado exitosamente" });

    } catch (error) {

        console.error("Error al agregar producto", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


// PUT: Editar o sobreescribir producto
router.put('/:pid', async (req, res) => {

    let pid = req.params.pid;
    const updatedProd = req.body;

    try {

        const productUpdated = await prodManager.updateProduct(pid, updatedProd);



        if(!productUpdated) {

            res.status(404).send({ message: "El producto que desea actualizar no existe"});

        } else {

            res.json({ message: "Producto actualizado exitosamente" });

        }

    } catch (error) {

        console.log(error)
        res.status(500).json(error, `Error al intentar editar el producto con id ${pid}`);
    }
});


// DELETE: Eliminar producto
router.delete('/:pid', async (req, res) => {
    let pid = req.params.pid;

    try {
        await prodManager.deleteProduct(pid)
        res.status(200).json({message: "Producto eliminado correctamente"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Error al intentar eliminar el producto"})
    }
});


module.exports = router;


