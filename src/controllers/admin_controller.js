const adminService = require('../services/admin_service');
const { HandleError, HandleSuccess } = require('../utils/handle_response');

const AdminController = {
    createAdmin: async (req, res) => {
        try {
            const message = await adminService.createAdmin(req.body);
            return HandleSuccess(res, 200, message);
        } catch (err) {
            console.error(`Erro ao criar admin: ${err}`);
            return HandleError(res, 500, `Falha na criação de admin: ${err.message}`);
        }
    },

    loginAdmin: async (req, res) => {
        try {
            const { message, token } = await adminService.loginAdmin(req.body);
            return HandleSuccess(res, 200, message, { token });
        } catch (err) {
            console.error(`Erro ao logar como admin: ${err}`);
            return HandleError(res, 500, `Falha ao logar como admin: ${err.message}`);
        }
    },

    addNewItemsViaJSON: async (req, res) => {
        try {
            const result = await adminService.addNewItemsViaJSON(req.body);
            return HandleSuccess(res, 200, result.message, { addedItems: result.addedItems });
        } catch (err) {
            console.error(`Erro na atualização de produtos: ${err}`);
            return HandleError(res, 500, `Falha na atualização dos produtos no banco de dados: ${err.message}`);
        }
    }
}

module.exports = AdminController;