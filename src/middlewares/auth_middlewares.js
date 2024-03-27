const { body, validationResult } = require('express-validator');
const { HandleError } = require('../utils/handle_response');

const validateCreateUser = [
    body('email', 'Email incorreto').isEmail(),
    body('username', "Nome inválido").isLength({min: 3, max: 20}),
    body('password', "Senha inválida").isLength({min: 8}),
    body('cep_location', "CEP não fornecido").not().isEmpty(),
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

const validateLoginUser = [
    body('email', 'Email incorreto').isEmail(),
    body('password', 'Senha incorreta').isLength({ min: 8 }),
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

module.exports = { validateCreateUser, validateLoginUser };