const express = require('express')
const fetch = require('node-fetch')

const getSources = require('../utils/utils').getSources
const logger = require('../utils/logger')

const router = express.Router()

router.get("/", async (_req, res) => {
  try {
    await getSources()
  } catch (err) {
    logger.error(err)
    return res.status(500).send({ status: "unhealthy" });
  }
  return res.status(200).send({ status: "healthy" })
});

module.exports = router;
