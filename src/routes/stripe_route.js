const express = require('express');
const StripeRouter = express.Router();
const StripeController = require('../controllers/stripe_controller');

StripeRouter.post('/webhook', express.raw({ type: 'application/json' }), StripeController.HandleWebhooks);

module.exports = StripeRouter;