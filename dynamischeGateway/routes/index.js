const express = require("express");
const router = express.Router();
const axios = require("axios");
const registry = require("./registry.json");
const fs = require("fs");

router.all("/:apiName/:path", (req, res) => {
  console.log("this works");
  if (registry.services[req.params.apiName]) {
    axios({
      method: req.method,
      url: registry.services[req.params.apiName].url + req.params.path,
      headers: req.headers,
      data: req.body,
    }).then((response) => {
      res.send(response.data);
    });
  } else {
    res.status(404);
    res.send("Api name does not exist in registry");
  }
});

router.post('/register', (req, res) => {
  const registrationInfo = req.body;

  registrationInfo.url = registrationInfo.protocol + "://" + registrationInfo.host + ":" + registrationInfo.port + '/';
  registry.services[registrationInfo.apiName] = { ...registrationInfo };
  fs.writeFile('./routes/registry.json', JSON.stringify(registry), (error) => {
    if (error) {
      res.send("Could not register `" + registrationInfo.apiName + "`\n" + error);
    } else {
      res.send("Successfully registered `" + registrationInfo.apiName + "`");
    }
  }
  );
});

module.exports = router;
