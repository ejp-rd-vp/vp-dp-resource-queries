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

// load dependencies
const express = require("express")
const winston = require('winston')
const morgan = require("morgan")
const cors = require("cors")
const helmet = require("helmet")
const fs = require('fs')
const path = require("path")
const rateLimit = require("express-rate-limit")

/**
 * Create Express Application and register middlewares
 */

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
if (process.env.NODE_ENV !== "production") {
  app.options("*", cors())
  app.use(morgan("dev"))
}
app.use(morgan('common', {
  stream: fs.createWriteStream(path.join(__dirname, '../logs', 'access.log'), { flags: 'a' })
}))
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.RESOURCE_INTERFACE_RATE_LIMIT
}))

/**
 * Add routes
 */

app.use("/health", require('./routes/health'))
app.use("/api", require('./routes/api'))
app.use("/api/v1/resources", require('./routes/resources'))
app.use("/api/v1/search", require('./routes/apiV1Search'))
app.use("/classification", require('./routes/classification'))
app.use("/map", require('./routes/map'))
app.use("/genes", require('./routes/genes'))

module.exports = app

