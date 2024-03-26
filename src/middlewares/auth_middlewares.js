const { body, validationResult } = require('express-validator');

const validateCreateUser = [
    body('email', 'Email incorreto').isEmail(),
    body('name', "Nome inválido").isLength({min: 3, max: 20}),
    body('password', "Senha inválida").isLength({min: 8}),
    body('cep_location', "CEP não fornecido").isEmpty()
];

module.exports = { validateCreateUser };