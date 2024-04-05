const Order = require('../models/order');
const User = require('../models/user');
const { HandleError, HandleSuccess } = require('../utils/handle_response');
const { SignToken } = require('../utils/handle_token');
const Stripe = require('stripe');

const AuthController = {
    createUser: async (req, res) => {
        try {
            const { username, email, password, cep_location } = req.body;

            if (!username || !email || !password || !cep_location) return HandleError(res, 400, "Falha ao cadastrar usuário: Campos não preenchidos corretamente. Tente novamente");

            const registered = await User.findOne({ email: email });
            if (registered) return HandleError(res, 400, "Usuário já está registrado");

            const newUser = new User({
                name: username,
                email: email,
                password: password,
                cep_location: cep_location
            });

            await newUser.save();

            return HandleSuccess(res, 200, "Conta criada com sucesso!");
        }
        catch (err) {

            console.log("Erro ao criar conta: ", err);
            return HandleError(res, 500, `Falha ao criar usuário`);
        }
    },

    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body;

            const userData = await User.findOne({ email: email });
            if (!userData) return HandleError(res, 404, "Usuário não encontrado");

            const isPassMatched = await userData.comparePassword(password);
            if (!isPassMatched) return HandleError(res, 400, "Senha incorreta");

            const authData = {
                user: {
                    id: userData.id,
                }
            }

            const token = SignToken(authData);

            return HandleSuccess(res, 200, "Conta de usuário logada com sucesso", { token: token });
        }
        catch (err) {
            console.log("Erro ao logar conta: ", err);
            return HandleError(res, 500, `Falha ao logar usuário`);
        }
    },

    getUserData: async (req, res) => {
        try {
            const { userId } = req.body;

            if (!userId) return HandleError(res, 401, `Id de usuário não encontrado`);

            const userData = await User.findById(userId);
            if (!userData) return HandleError(res, 401, `Usuário não encontrado`);

            return HandleSuccess(res, 200, "Usuário autorizado", userData);
        }
        catch (err) {
            console.log("Erro ao buscar dados de usuário: ", err);
            return HandleError(res, 500, `Falha ao buscar dados de usuário`);
        }
    },

    successfulTokenValidation: async (req, res) => {
        try {
            return HandleSuccess(res, 200, "Usuário autorizado");
        }
        catch (err) {
            console.log("Erro ao validar token: ", err);
            return HandleError(res, 500, `Falha ao validar token`);
        }
    },
    purchaseItems: async (req, res) => {
        try {
            const { items, userId } = req.body;
            
            if (!userId) return HandleError(res, 401, `Usuário não encontrado`);

            console.log("Items to purchase: ", items);

            if (!items) return HandleError(res, 404, "Nenhum item encontrado");

            const itemsToPurschase = items.map(item => ({
                price_data: {
                    currency: "brl",
                    product_data: {
                        name: item.name,
                        images: [item.image]
                    },
                    unit_amount: Math.round(parseFloat(item.price) * 100),
                },
                quantity: item.quantity
            }));

            const stripe = Stripe(process.env.STRIPE_SECRET);

            const checkoutSession = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: itemsToPurschase,
                mode: 'payment',
                success_url: `${process.env.FRONTEND_URL}/success-purchase`,
                cancel_url: `${process.env.FRONTEND_URL}/cancel-purchase`
            });

            const checkoutData = {
                id: checkoutSession.id
            }

            return HandleSuccess(res, 200, "Redirecionamento para compra...", checkoutData);
        }
        catch (err) {
            console.log("Erro ao comprar produtos: ", err);
            return HandleError(res, 500, `Falha ao comprar produtos`);
        }
    },
    createOrder: async (req, res) => {
        try {
            const { userId, items, identityData  } = req.body;
            if (!userId || !items || !identityData) return HandleError(res, 401, `Dados incompletos para criar o pedido.`);

            console.log("Criação de Pedido...");

            const newOrder = new Order({
                owner: userId,
                products: items,
                identityData: identityData
            });
            
            await newOrder.save();

            return HandleSuccess(res, 200, "Pedido criado com sucesso");

        } 
        catch (err) {
            console.log("Erro ao criar pedido: ", err);
            return HandleError(res, 500, `Falha ao criar pedido`);
        }
    },
    getOrders: async (req, res) => {
        try {
            const { userId } = req.body;

            if (!userId) return HandleError(res, 401, `Id de usuário não encontrado`);
            
            console.log(`Buscando pedidos pedidos de usuário ${userId} ...`);

            const orders = await Order.find({owner: userId});
            if(!orders) return HandleError(res, 404, "Nenhum pedido feito pelo usuário foi encontrado");

            return HandleSuccess(res, 200, "Pedidos encontrados com sucesso.", orders);
        } 
        catch (err) {
            console.log("Erro ao buscar pedidos: ", err);
            return HandleError(res, 500, `Falha ao buscar pedidos`);
        }
    }
}

module.exports = AuthController;