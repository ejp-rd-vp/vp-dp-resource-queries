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


const fetch = require("node-fetch")
const handleFetchErrors = require('./utils').handleFetchErrors
const numberToRandomRange = require('./utils').numberToRandomRange
const convertResourceResponsesToArray = require('./utils').convertResourceResponsesToArray
const logger = require('./logger')
const Process = require("process");

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
                        name: source.resourceName,
                        numTotalResults: contentTemp.resourceResponses.length,
                        content: contentTemp,
                    }
                    resolve(returnData)
                }
                else {
                    console.log(source.resourceName + ': ' + 204)
                    resolve(null)
                }
                }
                else {
                    console.log(source.resourceName + ': ' + fetchResponse.status)
                    resolve(null)
                }
            })
            .catch((exception) => {
                logger.log('error', 'Error in executeCatalogueQuery():fetch(): ' + exception)
                console.error("Error in executeCatalogueQuery():fetch(): ", exception)
                resolve(null)
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
                  const content = convertResourceResponsesToArray(contentTemp[0])
              let returnData = {
                  name: source.resourceName,
                  numTotalResults: content.resourceResponses.length,
                  content
              }
              resolve(returnData)
            }
          }
          else {
            console.log(source.resourceName + ': ' + fetchResponse.status)
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
            if (source.resourceName.toLowerCase() == 'erkreg') {
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
            else if (source.resourceName == 'eurreca') {
              for (let result of contentTemp["resultSets"]) {
                if (result.id.toLowerCase() == 'eurreca' && result.resultCount > 0) {
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
            console.log(source.resourceName + ': ' + 204)
            resolve(null)
          }
        }
        else {
          console.log(source.resourceName + ': ' + fetchResponse.status)
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

module.exports.executeHierarchyQuery = (code, way) => {
    try {
        const query = 'http://155.133.131.171:8080/ClassifTraversal/hierarchies/traverse?code=' + code + '&way=' + way
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
                        let orphaCodes = []
                        if (way.toLowerCase() === 'up') {
                            for (let parent of contentTemp.parents) {
                                for (let parentParent of parent.parents) {
                                    orphaCodes.push('Orphanet_' + parentParent.code)
                                }
                            }
                        }
                        if (way.toLowerCase() === 'down') {
                            for (let child of contentTemp.childs) {
                                for (let childChild of child.childs) {
                                    orphaCodes.push('Orphanet_' + childChild.code)
                                }
                            }
                        }
                        resolve(orphaCodes)
                    }
                    else {
                        console.log(source.resourceName + ': ' + fetchResponse.status)
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

module.exports.executeIndividualsQuery = (source, individualsBody) => {
    try{
        const authKey = JSON.parse(process.env.AUTH_KEYS)[source.resourceName];
        return new Promise(async (resolve, reject) => {
            await fetch(`${source.resourceAddress}`, {
                method: 'post',
                headers: {'Accept': 'application/json', 'auth-key': authKey},
                body: individualsBody
            })
                .then(this.handleFetchErrors)
                .then(async (fetchResponse) => {
                    if (fetchResponse.status >= 200 && fetchResponse.status < 400) {
                        let data = await fetchResponse.json()
                        let returnData = {
                            name: source.resourceName,
                            numTotalResults: numberToRandomRange(data.responseSummary.numTotalResults, 15),
                            content: { resourceResponses: null }
                        }
                        resolve(returnData)
                    } else {
                        resolve(fetchResponse.status)
                        return
                    }
            })
            .catch((exception) => {
                logger.log('error', 'Error in portal:portal.js:app.get(/individuals):fetch(): ' + exception, source["resourceName"]);
                console.error("Error in portal:portal.js:app.get(/individuals):fetch(): ", exception);
                resolve(null)
            })
        })
    } catch(exception) {
        logger.error('Error in executeVivifyQuery(): ' + exception)
        console.error("Error in executeVivifyQuery(): ", exception)
    }
}



module.exports.executeClassification = (code, way) => {
    try {
        let query = process.env.CLASSIFICATION_API+"code=" + code + "&way=" + way;
        return new Promise(async (resolve, reject) => {
            await fetch(query)
                .then(this.handleFetchErrors)
                .then(async (fetchResponse) => {
                    if (fetchResponse.status >= 200 && fetchResponse.status < 400) {
                        const responseData = await fetchResponse.json();
                        resolve(responseData)
                    }else{
                        reject(fetchResponse.status);
                    }
                })
                .catch((exception) => {
                    console.error(exception);
                    // response.sendStatus(404);
                })
        })
    }catch (exception) {
        console.error("Error in portal:portal.js:app.get(/classification): ",exception);
    }
}

module.exports.executeMapping = (code, from, to) => {
    try {
        let query = ""
        if (to) {
            query = Process.env.MAPPING_API+"from="+from+"&code="+code+"&to="+to;
        }
        else {
            query = Process.env.MAPPING_API+"from="+from+"&code="+code;
        }
        return new Promise(async (resolve, reject) => {
            await fetch(query)
                .then(this.handleFetchErrors)
                .then(async (fetchResponse) => {
                    if (fetchResponse.status >= 200 && fetchResponse.status < 400) {
                        const responseData = await fetchResponse.json();
                        resolve(responseData)
                    }else{
                        reject(fetchResponse.status);
                    }
                })
                .catch((exception) => {
                    console.error(exception);
                    // response.sendStatus(404);
                })
        })
    }catch (exception) {
        console.error("Error in portal:portal.js:app.get(/map): ",exception);
    }

}

module.exports.executeGenes = (input, by) => {
    try {
        let query = ""
        query = Process.env.GENES_API+"by="+by+"&input="+input;

        return new Promise(async (resolve, reject) => {
            await fetch(query)
                .then(this.handleFetchErrors)
                .then(async (fetchResponse) => {
                    if (fetchResponse.status >= 200 && fetchResponse.status < 400) {
                        const responseData = await fetchResponse.json();
                        resolve(responseData)
                    }else{
                        reject(fetchResponse.status);
                    }
                })
                .catch((exception) => {
                    console.error(exception);
                    // response.sendStatus(404);
                })
        })
    }catch (exception) {
        console.error("Error in portal:portal.js:app.get(/map): ",exception);
    }

}
