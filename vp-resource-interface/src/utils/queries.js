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

const fetch = require("node-fetch")

const handleFetchErrors = require('./utils').handleFetchErrors
const logger = require('./logger')

module.exports.executeCatalogueQuery = (source, query) => {
    try {
        return new Promise(async (resolve, reject) => {
            await fetch(query)
            .then(handleFetchErrors)
            .then(async (fetchResponse) => {
                if(fetchResponse.status >= 200 && fetchResponse.status < 400) {
                let contentTemp = await fetchResponse.json()
                if(contentTemp.resourceResponses.length > 0) {
                    let returnData = {
                      name: source.catalogueName,
                      content: contentTemp,
                    }
                    resolve(returnData)
                }
                else {
                    console.log(source.catalogueName + ': ' + 204)
                    resolve(null)
                }
                }
                else {
                    console.log(source.catalogueName + ': ' + fetchResponse.status)
                    resolve(null)
                }
            })
            .catch((exception) => {
                logger.log('error', 'Error in executeCatalogueQuery():fetch(): ' + exception)
                console.error("Error in executeCatalogueQuery():fetch(): ", exception)
            })
        })
    } catch(exception) {
        logger.log('error', 'Error in executeCatalogueQuery(): ' + exception)
        console.error("Error in executeCatalogueQuery(): ", exception)
    }    
}

module.exports.executeKnowledgeBaseQuery = (source, query) => {
  try {
    return new Promise(async (resolve, reject) => {
      await fetch(query, {
          headers: {
          'Accept': 'application/json'
          }
      })
      .then(handleFetchErrors)
      .then(async (fetchResponse) => {
          if (fetchResponse.status >= 200 && fetchResponse.status < 400) {
            let contentTemp = await fetchResponse.json()
            if(contentTemp.length > 0 && contentTemp[0]['resourceResponses']) {
              let returnData = {
                name: source.catalogueName,
                content: contentTemp[0],
              }
              resolve(returnData)
            }
          }
          else {
            console.log(source.catalogueName + ': ' + fetchResponse.status)
            resolve(null)
          }
      })
      .catch((exception) => {
          logger.log('error', 'Error in executeKnowledgeBaseQuery():fetch(): ' + exception)
          console.error("Error in executeKnowledgeBaseQuery():fetch(): ", exception)
      })
    })
  } catch(exception) {
    logger.log('error', 'Error in executeKnowledgeBaseQuery(): ' + exception)
    console.error("Error in executeKnowledgeBaseQuery(): ", exception)
  }
}

module.exports.executeBeaconQuery = (source, query, beaconBody, token) => {
  try {
    return new Promise(async (resolve, reject) => {
      await fetch(query, {
        method: 'post',
        body: JSON.stringify(beaconBody),
        headers: {'Content-Type': 'application/json', 'auth-token': token}
      })
      .then(this.handleFetchErrors)
      .then(async (fetchResponse) => {
        if (fetchResponse.status >= 200 && fetchResponse.status < 400) {
          let contentTemp = await fetchResponse.json()
          if(contentTemp['responseSummary'].numTotalResults > 0 && contentTemp["resultSets"].length > 0) {
            if (source.catalogueName == 'ERKReg') {
              for (let result of contentTemp["resultSets"]) {
                if (result.id == 'ERKReg' && result.resultCount > 0) {
                  let returnData = {
                    name: result.Info.contactPoint,
                    content: result
                  }
                  resolve(returnData)
                }
              }
            }
            else if (source.catalogueName == 'EuRRECa') {
              for (let result of contentTemp["resultSets"]) {
                if (result.id == 'EuRRECa' && result.resultCount > 0) {
                  let returnData = {
                    name: result.Info.contactPoint,
                    content: result
                  }
                  resolve(returnData)
                }
              }
            }
          }
          else {
            console.log(source.catalogueName + ': ' + 204)
            resolve(null)
          }
        }
        else {
          console.log(source.catalogueName + ': ' + fetchResponse.status)
          resolve(null)
        }
      })
      .catch((exception) => {
        logger.error('Error in executeBeaconQuery():fetch(): ' + exception)
        console.error("Error in executeBeaconQuery():fetch(): ", exception)
      }) 
    })
  } catch(exception) {
    logger.error('Error in executeBeaconQuery(): ' + exception)
    console.error("Error in executeBeaconQuery(): ", exception)
  } 
}

module.exports.executeIndividualsQuery = (source, beaconBody) => {
    try{
        let authkey = process.env.AUTH_KEY;
        authkey = authkey.toString();
        let authkeyArray = authkey.split("/");
        let authkeyHeader = "";
        for(let a = 0; a < authkeyArray.length; a++){
            if(authkeyArray[a].includes(source["catalogueName"])){
                let authkeyArraySplit = authkeyArray[a].split(":");
                authkeyHeader = authkeyArraySplit[1];
            }
        }
        return new Promise(async (resolve, reject) => {
            await fetch(`${source.catalogueAddress}`, {
                method: 'post',
                headers: {'Content-Type': 'application/json', 'auth-key': authkeyHeader}, //`process.env.${source["catalogueName"]}_AUTHKEY`},
                body: beaconBody
            })
                .then(this.handleFetchErrors)
                .then(async (fetchResponse) => {
                    if (fetchResponse.status >= 200 && fetchResponse.status < 400) {
                        let data = await fetchResponse.json()
                        console.log("ANSWER " + JSON.stringify(data));
                       // resolve.json(data)
                    } else {
                        //resolve.sendStatus(fetchResponse.status)
                        return
                    }
            })
            .catch((exception) => {
                logger.log('error', 'Error in portal:portal.js:app.get(/individuals):fetch(): ' + exception, source["catalogueName"]);
                console.error("Error in portal:portal.js:app.get(/individuals):fetch(): ", exception);
            })
        })
    }catch(exception) {
        logger.error('Error in executeVivifyQuery(): ' + exception)
        console.error("Error in executeVivifyQuery(): ", exception)
    }
}
