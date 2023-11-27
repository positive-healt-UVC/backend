const express = require("express");
const router = express.Router();
const axios = require("axios");
const registry = require("./registry.json");

router.all("/:apiName/:path/*", (req, res) => {
  // Check if the requested API is registered
  if (registry.services[req.params.apiName]) {
    // Perform a request to the request api
    axios({
      method: req.method,
      url: registry.services[req.params.apiName].url + req.params.path + '/' + req.params['0'],
      headers: req.headers,
      data: req.body,
    })
    
    // If succesful, get the response data
    .then((response) => {
      res.send(response.data);
    })
    
    // Handle potential errors
    .catch((reason) => {
      // Check if the error has to do with a 304 within the axios service
      if (reason.message.includes('304')) {
        // Redirect the user to the same url to retry
        res.redirect(req.url);
        return;
      }

      // There is another problem, return the issue
      res.status(500);
      res.send(reason);
    });
  }
  
  // The API is not registered, tell the user
  else {
    res.status(404);
    res.send("API does not exist in registry.");
  }
});

module.exports = router;
