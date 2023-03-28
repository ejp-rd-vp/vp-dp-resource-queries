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

// load dependencies
const http = require('http')
const fs = require('fs')
const path = require("path")
const dotenv = require('dotenv').config()

const normalizePort = require('../src/utils/utils').normalizePort
const logger = require('../src/utils/logger')
const app = require("../src/app")

/**
 * Normalize a port into a number, string, or false.
 */
  
const port = normalizePort(process.env.RESOURCE_INTERFACE_PORT || "3006")
app.set("port", port)


const server = http.createServer(app)

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== "listen") {
        throw error
    }

    const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            logger.error(`${bind} requires elevated privileges`)
            process.exit(1)
            break
        case "EADDRINUSE":
            logger.error(`${bind} is already in use`)
            process.exit(1)
            break
        default:
            throw error
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address()
    const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`
    logger.info(`VP Resource Interface listening on ${bind}`)
}

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port)
server.on("error", onError)
server.on("listening", onListening)