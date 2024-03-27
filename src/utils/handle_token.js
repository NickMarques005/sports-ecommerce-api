const { jwt_main_key } = require('../config/env_config');
const jwt = require('jsonwebtoken');

const SignToken = (auth_data) => {
    const token = jwt.sign(auth_data, jwt_main_key);
    return token;
};

const TokenVerification = (token) => {
    console.log("Verifying Token: ", token);
    const decoded = jwt.verify(token, jwt_main_key);

    return decoded;
}

module.exports = { SignToken, TokenVerification };