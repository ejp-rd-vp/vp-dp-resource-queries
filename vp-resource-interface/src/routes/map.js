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

const router = express.Router()

router.get("/", async (request, response) => {
    try {
        const code = request.query.code
        const from = request.query.from
        const to = request.query.to
        let query = ""
        if (to) {
        query = `${this.mappingEndpoint}map?from=${from}&code=${code}&to=${to}`
        }
        else {
        query = `${this.mappingEndpoint}map?from=${from}&code=${code}`
        }
        fetch(query)
        .then(this.handleFetchErrors)
        .then(async (fetchResponse) => {
            if (fetchResponse.status >= 200 && fetchResponse.status < 400) {
            const responseData = await fetchResponse.json();
            if(typeof(responseData) == "object") {
                response.json(responseData)
            }
            else {
                response.sendStatus(404);
            }
            } 
            else {
            response.sendStatus(404);
            }
        })
        .catch((exception) => {
            console.error(exception)
            response.sendStatus(404)
        });
    } catch (exception) {
        console.error("Error in portal:portal.js:app.get(/pingCatalogue): ", exception)
    }
})

module.exports = router