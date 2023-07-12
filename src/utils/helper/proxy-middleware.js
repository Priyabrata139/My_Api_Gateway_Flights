const flightsServiceProxy = { target: 'http://localhost:3000', changeOrigin: true, pathRewrite: {'^/flightsService' : '/'} };

const bookingServiceProxy = {
    target: 'http://localhost:4000', // target host
    changeOrigin: true, // needed for virtual hosted sites
    ws: true, // proxy websockets
    pathRewrite: {
      '^/bookingsService': '/', // rewrite path
      '^/api/remove/path': '/path', // remove base path
    },
    router: {
      // when request.headers.host == 'dev.localhost:3000',
      // override target 'http://www.example.org' to 'http://localhost:8000'
      'dev.localhost:5000': 'http://localhost:4000',
    },
  };
  
 

  module.exports= {
    flightsServiceProxy,
    bookingServiceProxy
  };

  