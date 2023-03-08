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

  Author/Maintainer: Aylin Demir (aylin.demir@ejprd-project.eu), David Reinert (david.reinert@ejprd-project.eu)
*/

"use strict"

const express = require("express")

const logger = require('../utils/logger')
const {executeClassification} = require("../utils/queries");
const getSources = require('../utils/utils').getSources
const extractQueryParameters = require('../utils/utils').extractQueryParameters
const buildIndividualsBody = require('../utils/queryBuilders').buildIndividualsBody
const executeIndividualsQuery = require('../utils/queries').executeIndividualsQuery

const router = express.Router()

router.get("/", async (request, response) => {
    try {
        console.log("INDIVIDUALS");
        let dataToBeReturned = [];
      //  if(request.query.disease && request.query.source) {
        if(request.query.disease){
            console.log("request.query.source");
            let sourceString = '["'+request.query.catalogueName +'", "'+ request.query.catalogueAddress+'"]';
            console.log(request.query.catalogueName);
            console.log(request.query.catalogueAddress);
            console.log("sourceString");
            console.log(sourceString);
            const source = JSON.parse(sourceString)

            let filters = {
                disease: '',
                genders: [],
                ageThisYear: '',
                symptomOnset: '',
                ageAtDiagnosis: ''
            }
            filters.disease = request.query.disease
            if(request.query.genders) {
                filters.genders = request.query.genders
            }
            if(request.query.ageThisYear){
                filters.ageThisYear = request.query.ageThisYear
            }
            if(request.query.symptomOnset){
                filters.symptomOnset = request.query.symptomOnset
            }
            if(request.query.ageAtDiagnosis){
                filters.ageAtDiagnosis = request.query.ageAtDiagnosis
            }

            console.log("filters "+JSON.stringify(filters))
            //  let body = this.buildBeaconNetworkQuery(filters);
            let body = buildIndividualsBody(filters); //vp-api-spec v0.2
            let queryResult = executeIndividualsQuery(source, body)
            if(queryResult) {
                dataToBeReturned.push(queryResult)
            }
            response.status(200).json(dataToBeReturned)
            console.log("ANSWER "+queryResult)
        }
        else {
            response.json('Invalid or missing mandatory parameter.')
        }
    } catch (exception) {
        console.error("Error in portal:portal.js:app.get(/individuals): ", exception)
    }
})

module.exports = router