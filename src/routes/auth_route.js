const express = require('express');
const AuthController = require('../controllers/auth_controller');
const AuthRouter = express.Router();
const { verifyToken } = require('../middlewares/token_middlewares');
const { validateCreateUser, validateLoginUser } = require('../middlewares/auth_middlewares');

AuthRouter.post('/create', validateCreateUser, AuthController.createUser);
AuthRouter.post('/login', validateLoginUser, AuthController.loginUser);
AuthRouter.get('/data', verifyToken, AuthController.getUserData);
AuthRouter.post('/verify-token', verifyToken, AuthController.successfulTokenValidation);
AuthRouter.post('/purchase-items', verifyToken, AuthController.purchaseItems);
AuthRouter.get('/get-purchase-orders', verifyToken, AuthController.getOrders);

module.exports = AuthRouter;