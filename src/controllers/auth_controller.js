const user = require('../models/user');
const { HandleError, HandleSuccess }= require('../utils/handle_response');


const AuthController = {
    createUser : async (req, res) => {

    },

    loginUser : async (req, res) => {

    },

    getUserData : async (req, res) => {
        try {
            const { userId } = req.body;

            if(!userId) return HandleError(res, 401, `Id de usuário não encontrado`);

            const userData = await user.findById(userId);
            if(!userData) return HandleError(res, 401, `Usuário não encontrado`);

            return HandleSuccess(res, 200, "Usuário autorizado", userData);
        }
        catch (err){
            return HandleError(res, 500, `Erro interno no servidor ${err}`);
        }
    },
}

module.exports = AuthController;