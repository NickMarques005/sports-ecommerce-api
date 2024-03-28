const { body, validationResult } = require('express-validator');
const { HandleError } = require('../utils/handle_response');
const { TokenVerification } = require('../utils/handle_token');
const Admin = require('../models/admin');

const validateCreateAdmin = [
    body('email', 'Email incorreto').isEmail(),
    body('admin_name', "Nome inválido").isLength({min: 3, max: 20}),
    body('password', "Senha inválida. Mínimo 15 caracteres").isLength({min: 15}),
    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty())
        {
            const extractedErrors = errors.array().map(err => err.msg);
            const errorMessage = extractedErrors.join(" | ");
            return HandleError(res, 400, errorMessage);
        }

        next();
    }
];

const validateLoginAdmin = [
    body('email', 'Email incorreto').isEmail(),
    body('password', 'Senha incorreta').isLength({ min: 15 }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const extractedErrors = errors.array().map(err => err.msg);
            const errorMessage = extractedErrors.join(" | ");
            return HandleError(res, 400, errorMessage);
        }
        next();
    }
];


const validateAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return HandleError(res, 401, "Usuário não autorizado");
        }

        const token = authHeader.split(' ')[1];

        const decodedToken = TokenVerification(token);
        
        const admin = await Admin.findById(decodedToken.admin.id);

        if(!admin || !admin.isAdmin) return HandleError(res, 403, "Acesso negado. Requer privilégios de administrador");

        next();
    }
    catch (err) {
        console.error(`Erro interno no servidor ao validar admin: ${err}`);
        return HandleError(res, 500, `Falha ao validar admin`);
    }
};

module.exports = { validateAdmin, validateCreateAdmin, validateLoginAdmin };