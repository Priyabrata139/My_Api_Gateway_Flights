const publicUrls = require("../publicUrls/publicUrls");

// Function to check if the request is public
function isPublicRequest(incomeingUrl, method) {
  return publicUrls.some(
    (route) => route.url === incomeingUrl && route.methods.includes(method)
  );
}

module.exports = {
  isPublicRequest,
};
