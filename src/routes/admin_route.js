const express = require('express');
const AdminRouter = express.Router();
const AdminController = require('../controllers/admin_controller');
const { validateAdmin, validateCreateAdmin, validateLoginAdmin } = require('../middlewares/admin_middleware');

AdminRouter.post('/update-all-products', validateAdmin, AdminController.updateAllProducts);
AdminRouter.post('/create', validateCreateAdmin, AdminController.createAdmin);
AdminRouter.post('/login', validateLoginAdmin, AdminController.loginAdmin);

module.exports = AdminRouter;

