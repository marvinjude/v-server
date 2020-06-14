const express = require("express");
const { to } = require("await-to-js");
const { calculateLimitAndOffset, paginate } = require("paginate-info");
const generateQuery = require('../utils/generateQuery')

const router = express.Router();

const User = require("../models/User");

router.get("/", async function (req, res) {
  const { query = {} } = req;
  const { pagination = "{}", filter = "{}" } = query;
  const { currentPage = 1, pageSize = 30 } = JSON.parse(pagination);
  const generatedQuery = generateQuery(JSON.parse(filter));

  const { limit, offset } = calculateLimitAndOffset(currentPage, pageSize);

  const { length: count } = await User.find(generatedQuery);

  const [error, rows] = await to(
    User.find(generatedQuery).limit(limit).skip(offset)
  );

  const meta = paginate(currentPage, count, rows, pageSize);

  res.json({ success: error ? true : false, rows, meta });
});

module.exports = router;
