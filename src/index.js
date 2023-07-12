const express = require('express');

const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');
const rateLimiter = require('./utils/helper/ratelimiter');
const proxy = require('./utils/helper/proxy-middleware');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(rateLimiter);
app.use('/api', apiRoutes);


app.use('/flightsService', createProxyMiddleware(proxy.flightsServiceProxy));

app.use('/bookingsService', createProxyMiddleware(proxy.bookingServiceProxy));

app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
});
