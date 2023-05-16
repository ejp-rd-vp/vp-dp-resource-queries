"use strict"

const express = require("express")

const logger = require('../utils/logger')
const { executeHierarchyQuery } = require("../utils/queries/hierarchyQueries");
const { convertObjectToArray } = require("../utils/utils");
const { withTimeout } = require("../utils/utils");


const router = express.Router()

router.get("/", async (request, response) => {
    try {
        if(request.query.ways && request.query.ways.length > 0
            && request.query.levels && request.query.levels.length === 2
            && request.query.diseases && request.query.diseases.length > 0) {
            const diseases = convertObjectToArray(request.query.diseases)
            const ways = convertObjectToArray(request.query.ways)
            const levels = convertObjectToArray(request.query.levels)
            let hierarchyCodes = []
            for (let disease of diseases) {
                if (ways.includes('up')) {
                    const orphaCodesUp = await withTimeout(20000, executeHierarchyQuery(disease, 'up', levels))
                    if (orphaCodesUp) {
                        hierarchyCodes.push(...orphaCodesUp);
                    }
                }
                if (ways.includes('down')) {
                    const orphaCodesdown = await withTimeout(20000, executeHierarchyQuery(disease, 'down', levels))
                    if (orphaCodesdown) {
                        hierarchyCodes.push(...orphaCodesdown);
                    }
                }
            }
            response.status(200).json([...new Map(hierarchyCodes.map(v => [v.code, v])).values()])
        }
        else {
            logger.error('HTTP 400: Invalid or missing mandatory parameter.')
            response.status(400).json('Invalid or missing mandatory parameter.')
        }
    } catch (exception) {
        logger.error("Error in route /api/v1/hierarchy: ", exception)
        console.error("Error in route /api/v1/hierarchy: ", exception)
    }
})

module.exports = router