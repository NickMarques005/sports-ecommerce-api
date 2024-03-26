const { jwt_main_key } = require('../config/env_config');
const jwt = require('jsonwebtoken');

const SignToken = (auth_data) => {
    const token = jwt.sign(auth_data, jwt_main_key);
    return token;
}

module.exports = { SignToken }