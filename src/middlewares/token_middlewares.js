const jwt = require("jsonwebtoken");
const mainKey = require('../config/env_config').jwt_main_key;
const { HandleError } = require('../utils/handle_response');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader)
    {
        HandleError(res, 401, "Usuário não autorizado");
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = jwt.verify(token, mainKey);
        const userId = decodedToken.user.id;
        req.body.userId = userId;
        console.log("Decoded Data: ", userId);
        next();
    }
    catch(err)
    {
        return HandleError(res, 500, `Houve um erro interno no servidor: ${err}`)
    }
};

module.exports = { verifyToken };