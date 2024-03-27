const dotenv = require('dotenv').config;

const jwt_main_key = process.env.JWT_MAIN_KEY;

module.exports = {
    jwt_main_key
}