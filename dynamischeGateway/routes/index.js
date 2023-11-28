// Get all the dependencies for the server
const express = require("express");
const router = express.Router();
const axios = require("axios");
const registry = require("./registry.json");

/**
 * Print information on the incoming request to the console.
 * The format of the message will be: "Incoming request: [METHOD] URL".
 * All capitalized parts of this string will be replaced with their values.
 * 
 * Parameters need to be provided and be not empty.
 * If they are not, an error is printed to the console instead.
 * 
 * @param {string} method the method used to create the request (POST).
 * @param {string} url the url accessed by the request (/example/example).
 */
function logIncomingRequest(method, url) {
  // When all data has correctly been provided, print the info with the request details
  if (method && url) console.info(`Incoming request: [${method}] ${url}`);

  // When the data isn't present, print an error
  else console.error('Incoming request with invalid parameters.');
}

/**
 * Check whether a micro service is registered in the registry file.
 * 
 * @param {string} requestApi the requested micro service.
 * @returns true if the service exists, false otherwise.
 */
function serviceExist(requestApi) {
  return registry.services[requestApi] !== undefined;
}

/**
 * Create a URL to the target micro service.
 * 
 * @param {object} requestParameters the parameters bundled with the original request (req.params).
 * @returns the formatted target url (http://API:PORT/ROUTE/PARAMETERS). 
 */
function createTargetUrl(requestParameters) {
  return registry.services[requestParameters.apiName].url
    + requestParameters.path + '/'
    + requestParameters['0'];
}

/**
 * Perform a call to a target microservice using the request object.
 * While performing the call, this function create the url using the createTargetUrl method.
 * 
 * @param {object} originalRequest the original request (req).
 * @returns the axios call to the micro service.
 */
function performRequest(originalRequest) {
  return axios({
    // Pass through the method used to connect to this route
    method: originalRequest.method,

    // Create the URL to the target micro service
    url: createTargetUrl(originalRequest.params),

    // Define the headers and disable cache to allow succeeding calls
    headers: {
      ...originalRequest.headers,
      'Cache-Control': 'no-cache',
    },

    // Copy the data from the body of the original request into the new request
    data: originalRequest.body,
  })
}

/**
 * Create a function that can be used to handle the response of the Axios call.
 * 
 * @param {object} responseHandler the response object of the original request (res).
 * @returns a function that can be used as event handler in then/catch.
 */
function createResponseHandler(responseHandler) {
  return (response) => {
    responseHandler.send(response.data);
  }
}

/**
 * Create a function that can deal with errors during the Axios call.
 * 
 * @param {object} responseHandler the response object of the original request (res).
 * @returns a function that can be used as event handler in then/catch.
 */
function createErrorHandler(responseHandler) {
  return (error) => {
    console.error(error);
  }
}

/**
 * Deal with the situation where the requested service does not exist.
 * 
 * @param {object} responseHandler responseHandler the response object of the original request (res).
 */
function handleNotDefined(responseHandler) {
  responseHandler.status(404);
  responseHandler.send("API is not registered.");
}

// Create a route that catches all incoming requests and redirects them to the right microservice
router.all("/:apiName/:path/*", (req, res) => {
  // Log the request to the console
  logIncomingRequest(req.method, req.url);

  // Check whether the requested service exist
  if (serviceExist(req.params.apiName)) {
    // Perform the request to the target service
    performRequest(req)
      .then(createResponseHandler(res))
      .catch(createErrorHandler(res));

    // Stop the execution of the function
    return;
  }
  
  // The requested service does not exit, handle the not defined situation
  handleNotDefined(res);
});

module.exports = {
  "router": router,
  "logIncomingRequest": logIncomingRequest,
  "serviceExist": serviceExist,
  "createTargetUrl": createTargetUrl,
  "performRequest": performRequest,
  "createResponseHandler": createResponseHandler,
  "createErrorHandler": createErrorHandler,
  "handleNotDefined": handleNotDefined
};