const authenticate = require("./authenticate");
const { authorize, authorizeResource } = require("./authorize");
const errorHandler = require("./errorHandler");
const requestLogger = require("./requestLogger");

module.exports = {
    authenticate,
    authorize,
    authorizeResource,
    errorHandler,
    requestLogger,
};
