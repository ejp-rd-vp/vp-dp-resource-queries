/* 
  Copyright 2022 EJP-RD Partners

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

  Author/Maintainer: David Reinert (david.reinert@ejprd-project.eu)
*/

"use strict"

const express = require("express")

const logger = require('../utils/logger')
const {buildIndividualsBody} = require("../utils/queryBuilders");
const {executeIndividualsQuery} = require("../utils/queries");
const getSources = require('../utils/utils').getSources
const extractQueryParameters = require('../utils/utils').extractQueryParameters
const buildCatalogueQuery = require('../utils/queryBuilders').buildCatalogueQuery
const executeCatalogueQuery = require('../utils/queries').executeCatalogueQuery
const executeKnowledgeBaseQuery = require('../utils/queries').executeKnowledgeBaseQuery

const router = express.Router()

const TIMEOUT = 3000
const withTimeout = (millis, promise) => {
  const timeout = new Promise((resolve, reject) =>
      setTimeout(
          () => resolve(null),
          millis));
  return Promise.race([
    promise,
    timeout
  ]);
};
router.get("/", async (request, response) => {
  try {
    if(request.query.disease) {
      let sources = []
      if(!request.query.source) {
        sources = await getSources()
      } else {
        sources.push(JSON.parse(request.query.source))
      }
      const parameters = extractQueryParameters(request)
      let dataToBeReturned = []
      let queryResult = null

      for(let source of sources) {
        if (source.queryType.includes('individuals')) {
          const body = await withTimeout(TIMEOUT, buildIndividualsBody(parameters));
          if (body) {
            queryResult = await withTimeout(TIMEOUT, executeIndividualsQuery(source, body))
          }
        } else if (source.queryType.includes('search.Catalogue')) {
          const query = buildCatalogueQuery(source.resourceAddress,
              parameters.diseaseCode, parameters.selectedTypes, parameters.selectedCountries)
          queryResult = await withTimeout(TIMEOUT, executeCatalogueQuery(source, query))
        } else if (source.queryType.includes('search.Knowledge')) {
          const query = `${source.resourceAddress}?code=http://www.orpha.net/ORDO/Orphanet_${parameters.diseaseCode}`
          queryResult = await withTimeout(TIMEOUT, executeKnowledgeBaseQuery(source, query))
        } else {
          logger.warn(`Entering default switch of route /api/v1/search for ${source.resourceName}`)
        }
        if (queryResult) {
          dataToBeReturned.push(queryResult)
        }
      }
      response.status(200).json(dataToBeReturned)
    }
    else {
      logger.error('HTTP 400: Invalid or missing mandatory parameter.')
      response.status(400).json('Invalid or missing mandatory parameter.')
    }
  } catch (exception) {
    logger.error("Error in route /api/v1/search: ", exception)
    console.error("Error in route /api/v1/search: ", exception)
  }
})

module.exports = router