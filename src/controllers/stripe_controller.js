const { HandleError, HandleSuccess } = require('../utils/handle_response');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const endpointSecret = process.env.ENDPOINT_SECRET;
const Order = require('../models/order');

const StripeController = {
    HandleWebhooks: async (req, res) => {
        const sig = req.headers['stripe-signature'];

        let data;
        let eventType;
        let event;

        try {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
            console.log("Webhook Verificado!");

            data = event.data.object;
            eventType = event.type;
        } catch (err) {
            console.log("Webhook Error: ", err.message);
            HandleError(res, 400, `Erro no Webhook do Stripe: ${err.message}`);
            return;
        }

        switch (eventType) {
            case "checkout.session.completed":
                stripe.customers.retrieve(data.customer).then( async (customer) => {
                    console.log(customer);

                    const orderData = customer.metadata;
                    
                    const orderRetrieved = {
                        owner: orderData.owner,
                        identityData: JSON.parse(orderData.identityData),
                        products: JSON.parse(orderData.products)
                    }
                    
                    console.log("New Order: ", orderRetrieved);

                    const newOrder = new Order({
                        owner: orderRetrieved.owner,
                        products: orderRetrieved.products,
                        identityData: orderRetrieved.identityData
                    });
        
                    await newOrder.save();

                    return HandleSuccess(res, 200, "Pedido executado com sucesso");
                }).catch(err => {
                    console.log(err.message);
                    return HandleError(res, 500, `Erro ao criar pedido após completar compra: ${err.message}`);
                });
            default:
                console.log("Evento não adicionado ou inválido: ", eventType);
                break;
        }
    }
}

module.exports = StripeController;