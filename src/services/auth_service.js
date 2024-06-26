const User = require('../models/user');
const Order = require('../models/order');
const { SignToken } = require('../utils/handle_token');
const Stripe = require('stripe');

class AuthService {
    async createUser(userData) {
        const { username, email, password, cep_location } = userData;

        if (!username || !email || !password || !cep_location) {
            throw new Error("Campos não preenchidos corretamente");
        }

        const registered = await User.findOne({ email });
        if (registered) {
            throw new Error("Usuário já está registrado");
        }

        const newUser = new User({
            name: username,
            email,
            password: password,
            cep_location
        });

        await newUser.save();

        return "Conta criada com sucesso!";
    }

    async loginUser(userData) {
        const { email, password } = userData;

        const user = await User.findOne({ email });
        if (!user) throw new Error("Usuário não encontrado");

        console.log("Verificação de Senha...");

        const isPassMatched = await user.comparePassword(password);
        if (!isPassMatched) throw new Error("Senha incorreta");

        const authData = { user: { id: user.id } };
        const token = SignToken(authData);

        return { message: "Conta de usuário logada com sucesso", token };
    }

    async getUserData(userId) {
        if (!userId) {
            throw new Error("Id de usuário não encontrado");
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new Error("Usuário não encontrado");
        }

        return user;
    }

    async purchaseItems(purchaseData) {
        const { items, userId, identityData } = purchaseData;

        if (!userId || !identityData) {
            throw new Error("Usuário não encontrado");
        }

        if (!items) {
            throw new Error("Nenhum item encontrado");
        }

        const itemsToOrder = items.map(item => {
            const price = parseFloat(item.price.replace(',', '.'));
            if (isNaN(price)) {
                throw new Error(`Preço inválido para o item ${item.name}`);
            }
            return { id: item.id, quantity: item.quantity, price };
        });

        const itemsToPurchase = items.map(item => {
            const price = parseFloat(item.price.replace(',', '.'));
            if (isNaN(price)) {
                throw new Error(`Preço inválido para o item ${item.name}`);
            }
            return {
                price_data: {
                    currency: "brl",
                    product_data: {
                        name: item.name,
                        images: [item.image]
                    },
                    unit_amount: Math.round(price * 100),
                },
                quantity: item.quantity
            };
        });

        const stripe = Stripe(process.env.STRIPE_SECRET);

        const customer = await stripe.customers.create({
            metadata: {
                owner: userId,
                products: JSON.stringify(itemsToOrder),
                identityData: JSON.stringify(identityData)
            }
        });

        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer: customer.id,
            line_items: itemsToPurchase,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/success-purchase`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel-purchase`
        });

        return { id: checkoutSession.id };
    }

    async getOrders(userId) {
        if (!userId) {
            throw new Error("Id de usuário não encontrado");
        }

        const orders = await Order.find({ owner: userId });
        if (!orders) {
            throw new Error("Nenhum pedido feito pelo usuário foi encontrado");
        }

        return orders;
    }
}

module.exports = new AuthService();