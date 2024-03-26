const user = require('../models/user');
const { HandleError, HandleSuccess }= require('../utils/handle_response');
const { SignToken } = require('../utils/handle_token');


const AuthController = {
    createUser : async (req, res) => {
        try{
            const { username, email, password, cep_location } = req.body;

            if(!username || !email || !password || !cep_location) return HandleError(res, 400, "Houve um erro ao cadastrar usuário: Campos não preenchidos corretamente. Tente novamente");

            const registered = await user.findOne({ email: email });
            if(registered) return HandleError(res, 400, "Usuário já está registrado");
        
            const newUser = new user({
                name: username,
                email: email,
                password: password,
                cep_location: cep_location
            });

            await newUser.save();

            return HandleSuccess(res, 200, "Conta criada com sucesso!");
        }
        catch(err)
        {
            
            console.log("Erro ao criar conta: ", err);
            return HandleError(res, 500, `Erro interno do servidor`);
        }
    },

    loginUser : async (req, res) => {
        try{
            const { email, password } = req.body;

            const userData = await user.findOne({ email: email });

            const isPassMatched = await userData.comparePass(password);
            if(!isPassMatched) return HandleError(res, 400, "Senha incorreta");
            
            const authData = {
                user: {
                    id: userData.id,
                }
            }

            const token = SignToken(authData);

            return HandleSuccess(res, 200, "Conta logada com sucesso", token);
        }
        catch(err)
        {
            console.log("Erro ao logar conta: ", err);
            return HandleError(res, 500, `Erro interno do servidor`);
        }
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
            return HandleError(res, 500, `Erro interno do servidor`);
        }
    },
}

module.exports = AuthController;