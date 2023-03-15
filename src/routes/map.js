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

  Author/Maintainer: David Reinert (david.reinert@ejprd-project.eu), Aylin Demir (aylin.demir@ejprd-project.eu)
*/

"use strict"

const express = require("express")
const Process = require("process");
const executeMapping = require("../utils/queries").executeMapping;

const router = express.Router()

router.get("/", async (request, response) => {
    try {

        let dataToBeReturned = [];
        if(request.query.disease) {

            //  let queryResult = await executeClassification(request.query.disease, request.query.way)
            let code = request.query.disease;
            let from = request.query.from;
            let to = request.query.to;

            from = "orphanet";
            to = "icd";

            let queryResult = await executeMapping(code, from, to)
            if(queryResult) {
                dataToBeReturned.push(queryResult)
            }
            response.status(200).json(dataToBeReturned)
        }
        else {
            response.json('Invalid or missing mandatory parameter.')
        }
    } catch (exception) {
        console.error("Error in portal:portal.js:app.get(/pingCatalogue): ", exception)
    }
})

module.exports = router