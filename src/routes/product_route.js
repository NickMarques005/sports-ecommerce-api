const express = require('express');
const ProductRouter = express.Router();
const ProductController = require('../controllers/product_controller');

ProductRouter.get('/data', ProductController.getProductData);
ProductRouter.post('/filter', ProductController.filterSearchData);
ProductRouter.get('/id/:id', ProductController.getProductById);

module.exports = ProductRouter;