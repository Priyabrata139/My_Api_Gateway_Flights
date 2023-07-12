const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    ROUNDS: process.env.ROUNDS,
    METHOD: process.env.METHOD,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY,
    RATE_LIMITE_TIME: process.env.RATE_LIMITE_TIME,
    RATE_LIMITE: process.env.RATE_LIMITE  
}