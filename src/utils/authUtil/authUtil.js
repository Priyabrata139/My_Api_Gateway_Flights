const publicUrls = require("../publicUrls/publicUrls");

function isPublicRequest(incomingUrl, method) {
  // Ignoring query parameters
  const path = incomingUrl.split("?")[0];

  return publicUrls.some((route) => {
    // Check if the path matches any pattern and method in the route
    return route.paths.some((pattern) => {
      const regex = new RegExp(
        `^${route.basePath}${pattern.replace(/:\w+/g, "\\d*")}$`
      );
      return regex.test(path) && route.methods.includes(method);
    });
  });
}

module.exports = {
  isPublicRequest,
};
