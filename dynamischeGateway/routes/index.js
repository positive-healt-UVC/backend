const express = require("express");
const router = express.Router();
const axios = require("axios");
const registry = require("./registry.json");

router.all("/:apiName/:path/*", (req, res) => {
  console.log("this works");
  if (registry.services[req.params.apiName]) {
    axios({
      method: req.method,
      url: registry.services[req.params.apiName].url + req.params.path + '/' + req.params['0'],    headers: {
        ...req.headers,
        'Cache-Control': 'no-cache',  // Add this header to disable caching
      },
      data: req.body,
    }).then((response) => {
      res.send(response.data);
    }).catch((err) => {
      console.error(err);
    });
  } else {
    res.status(404);
    res.send("Api name does not exist in registry");
  }
});

module.exports = router;