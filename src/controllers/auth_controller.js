const authService = require('../services/auth_service');
const { HandleError, HandleSuccess } = require('../utils/handle_response');

const AuthController = {
    createUser: async (req, res) => {
        try {
            const message = await authService.createUser(req.body);
            return HandleSuccess(res, 200, message);
        } catch (err) {
            console.error("Erro ao criar conta: ", err);
            return HandleError(res, 500, `Falha ao criar usuário: ${err.message}`);
        }
    },

    loginUser: async (req, res) => {
        try {
            const { message, token } = await authService.loginUser(req.body);
            return HandleSuccess(res, 200, message, { token });
        } catch (err) {
            console.error("Erro ao logar conta: ", err);
            return HandleError(res, 500, `Falha ao logar usuário: ${err.message}`);
        }
    },

    getUserData: async (req, res) => {
        try {
            const userData = await authService.getUserData(req.body.userId);
            return HandleSuccess(res, 200, "Usuário autorizado", userData);
        } catch (err) {
            console.error("Erro ao buscar dados de usuário: ", err);
            return HandleError(res, 500, `Falha ao buscar dados de usuário: ${err.message}`);
        }
    },

    successfulTokenValidation: async (req, res) => {
        try {
            return HandleSuccess(res, 200, "Usuário autorizado");
        } catch (err) {
            console.error("Erro ao validar token: ", err);
            return HandleError(res, 500, `Falha ao validar token`);
        }
    },

    purchaseItems: async (req, res) => {
        try {
            const checkoutData = await authService.purchaseItems(req.body);
            return HandleSuccess(res, 200, "Redirecionamento para compra...", checkoutData);
        } catch (err) {
            console.error("Erro ao comprar produtos: ", err);
            return HandleError(res, 500, `Falha ao comprar produtos: ${err.message}`);
        }
    },

    getOrders: async (req, res) => {
        try {
            const orders = await authService.getOrders(req.body.userId);
            return HandleSuccess(res, 200, "Pedidos encontrados com sucesso.", orders);
        } catch (err) {
            console.error("Erro ao buscar pedidos: ", err);
            return HandleError(res, 500, `Falha ao buscar pedidos: ${err.message}`);
        }
    }
}

module.exports = AuthController;