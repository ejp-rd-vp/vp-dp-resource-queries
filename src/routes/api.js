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
const path = require("path")

const logger = require('../utils/logger')

const router = express.Router()

router.get("/", (request, response) => {
  try {
    return response
      .status(200)
      .sendFile(path.join(__dirname, '..', '/apiDocs.html'))
  } catch (exception) {
    logger.error("Error in route /api: ", exception)
    return response
      .status(500)
      .send({ error: exception })
  }
})

module.exports = router