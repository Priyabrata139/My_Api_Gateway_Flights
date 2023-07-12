const rateLimit = require('express-rate-limit');

const { ServerConfig } = require('../../config');
console.log(ServerConfig.RATE_LIMITE_TIME);
const limiter = rateLimit({
	windowMs: ServerConfig.RATE_LIMITE_TIME, // 15 minutes
	max: ServerConfig.RATE_LIMITE, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
module.exports = limiter;