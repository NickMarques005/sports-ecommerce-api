const jwt = require("jsonwebtoken");
const mainKey = require('../config/env_config').jwt_main_key;
const { HandleError } = require('../utils/handle_response');
const { TokenVerification } = require("../utils/handle_token");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader)
    {
        return HandleError(res, 401, "Usuário não autorizado");
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = TokenVerification(token);
        const userId = decodedToken.user.id;
        req.body.userId = userId;
        console.log("Decoded Data: ", userId);
        next();
    }
    catch(err)
    {
        return HandleError(res, 401, `Usuário não autorizado: ${err}`);
    }
};

module.exports = { verifyToken };