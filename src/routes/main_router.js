const express = require('express');
const AuthRouter = require('./auth_route');
const ProductRouter = require('./product_route');
const AdminRouter = require('./admin_route');
const MainRouter = express.Router();

MainRouter.use("/user", AuthRouter);
MainRouter.use('/admin', AdminRouter);
MainRouter.use('/product', ProductRouter);

module.exports = MainRouter;
