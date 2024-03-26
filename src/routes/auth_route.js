const express = require('express');
const AuthController = require('../controllers/auth_controller');
const router = express.Router();

router.post('user/create', );

router.post('user/login', );

router.get('user/data', verifyToken, AuthController.getUserData);