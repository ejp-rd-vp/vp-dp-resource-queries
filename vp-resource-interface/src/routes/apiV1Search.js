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
const getSources = require('../utils/utils').getSources
const extractQueryParameters = require('../utils/utils').extractQueryParameters
const buildCatalogueQuery = require('../utils/queryBuilders').buildCatalogueQuery
const buildBeaconBody = require('../utils/queryBuilders').buildBeaconBody
const executeCatalogueQuery = require('../utils/queries').executeCatalogueQuery
const executeBeaconQuery = require('../utils/queries').executeBeaconQuery
const executeKnowledgeBaseQuery = require('../utils/queries').executeKnowledgeBaseQuery

const router = express.Router()

router.get("/", async (request, response) => {
  try {
    if(request.query.disease) {
      let sources = []
      // use all sources from the vp resource index
      if(!request.query.source) {
        sources = await getSources()
      }
      // use source specified in request
      else {
        sources.push(JSON.parse(request.query.source))
      }
      const parameters = extractQueryParameters(request)
      let dataToBeReturned = []
      let query = ''
      let queryResult = {}

      for(let source of sources) {
        switch(source.catalogueName) {
          case 'Cellosaurus': 
          case 'Wikipathways': 
          case 'hPSCreg':
            query = `${source.catalogueAddress}?code=http://www.orpha.net/ORDO/Orphanet_${parameters.diseaseCode}`
            queryResult = await executeKnowledgeBaseQuery(source, query)
            if(queryResult) {
              dataToBeReturned.push(queryResult)
            }
            break
          case 'Orphanet':
          case 'BBMRI-Eric':
            query = buildCatalogueQuery(source.catalogueAddress, parameters.diseaseCode, parameters.selectedTypes, parameters.selectedCountries)
            queryResult = await executeCatalogueQuery(source, query)
            if(queryResult) {
              dataToBeReturned.push(queryResult)
            }
            break
          // case 'erkreg':
          // case 'eurreca':
          //   if(parameters.token === undefined) {
          //     logger.error(401 + ' Unauthorized for ' + source.catalogueName)
          //     console.error(401 + ' Unauthorized for ' + source.catalogueName)
          //     continue
          //   }
          //   query = `${source.catalogueAddress}individuals`
          //   let beaconBody = buildBeaconBody(parameters)
          //   queryResult = await executeBeaconQuery(source, query, beaconBody, parameters.token)
          //   if(queryResult) {
          //     dataToBeReturned.push(queryResult)
          //   }
          //   break
          default:
            logger.warn(`Entering default switch of route /api/v1/search for ${source.catalogueName}`)
          //  console.warning(`Entering default switch of route /api/v1/search for ${source.catalogueName}`)
            break
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