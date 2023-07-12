const {ServerConfig} = require('../../config')

const flightsServiceProxy = { target: ServerConfig.FLIGHT_SERVICE, changeOrigin: true, pathRewrite: {'^/flightsService' : '/'} };

const bookingServiceProxy = {
    target: ServerConfig.BOOKING_SERVICE, // target host
    changeOrigin: true, // needed for virtual hosted sites
    ws: true, // proxy websockets
    pathRewrite: {
      '^/bookingsService': '/', // rewrite path
      '^/api/remove/path': '/path', // remove base path
    },
    router: {
      // when request.headers.host == 'dev.localhost:3000',
      // override target 'http://www.example.org' to 'http://localhost:8000'
      'dev.localhost:5000': ServerConfig.BOOKING_SERVICE,
    },
  };
  
 

  module.exports= {
    flightsServiceProxy,
    bookingServiceProxy
  };

  