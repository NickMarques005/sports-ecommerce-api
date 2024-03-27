const express = require('express');
const ProductRouter = express.Router();
const ProductController = require('../controllers/product_controller');

ProductRouter.get('/data', ProductController.getProductData);
ProductRouter.post('/filter', ProductController.filterSearchData);
ProductRouter.post('/id', ProductController.getProductById);

module.exports = ProductRouter;