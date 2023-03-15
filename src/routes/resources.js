"use strict"

const express = require("express")
const logger = require('../utils/logger')
const { resources }  = require('../../assets/js/vp-index')

const router = express.Router()

router.get("/", async (request, response) => {
    try {
        response.status(200).json(resources)
    } catch (exception) {
        logger.error("Error in route /api/v1/search: ", exception)
        console.error("Error in route /api/v1/search: ", exception)
    }
})

module.exports = router