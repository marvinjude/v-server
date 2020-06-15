var express = require("express");
const axios = require("axios");
const { to } = require("await-to-js");
var router = express.Router();

router.get("/", function (req, res) {
  return res.json({
    title: "Ven10 Assesment",
    author: "@marvinjudehk",
    duration: "30hrs",
  });
});

router.get("/filters", async function (req, res) {
  const [, response] = await to(
    axios.default(`https://ven10.co/assessment/filter.json`)
  );

  return res.status(response.status).json(response.data);
});

module.exports = router;
