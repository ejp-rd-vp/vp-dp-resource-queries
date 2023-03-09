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

const logger = require('./logger')

const { resources }  = require('../../assets/js/vp-index')

module.exports.handleFetchErrors = (fetchResponse) => {
    try {
      if (!fetchResponse.ok) {
        logger.error("Fetch Error: " + fetchResponse.status + " " + fetchResponse.statusText + " for " + fetchResponse.url)
        console.error("Fetch Error: " + fetchResponse.status + " " + fetchResponse.statusText + " for " + fetchResponse.url);
      }
      return fetchResponse;
    } catch (exception) {
      logger.error("Error in handleFetchErrors(): ", exception)
      console.error("Error in handleFetchErrors(): ", exception);
    }
}

module.exports.convertResourceResponsesToArray = (resource) => {
  if (resource.resourceResponses.constructor.name !== "Array") {
    resource.resourceResponses = [resource.resourceResponses]
  }
  return resource
}

module.exports.numberToRandomRange = (num, plusMinusPercent) => {
  const min = Math.round(num - num * getPercentageUpTo(plusMinusPercent))
  const max = Math.round(num + num * getPercentageUpTo(plusMinusPercent))
  return min + '-' + max
}

const getPercentageUpTo = (percentage) => {
  return Math.floor(Math.random() * percentage) / 100
};

const convertObjectToArray = (obj) => {
  if (obj.constructor.name !== "Array") {
    return [obj]
  }
  return obj
};

module.exports.extractOrphacode = (str) => {
  try {
    let number = str.match(/\d/g);
    if(number == null)
      return null;
    number = number.join("");
    return number;
  } catch (exception) {
    console.error("Error in extractOrphacode(): ", exception);
  }
}

module.exports.getSources = async () => {
  // return the static resources array because the VP-INDEX is not working.
  return resources;
  // try {
  //   return new Promise(async (resolve, reject) => {
  //     await fetch(`${process.env.RESOURCE_INDEX_URL}/catalogues`)
  //     .then(this.handleFetchErrors)
  //     .then(async (fetchResponse) => {
  //       if (fetchResponse.status >= 200 && fetchResponse.status < 400) {
  //         const data = await fetchResponse.json()
  //         resolve(data)
  //       }
  //       else {
  //         resolve(null)
  //       }
  //     })
  //     .catch((exception) => {
  //       reject(exception)
  //       logger.error("Error in getSources():fetch(): ", exception)
  //       console.error("Error in getSources():fetch(): ", exception)
  //     })
  //   })
  // } catch (exception) {
  //   logger.error("Error in getSources(): ", exception)
  //   console.error("Error in getSources(): ", exception)
  // }
}

module.exports.extractQueryParameters = (request) => {
  try {
    let parameters = {
      diseaseCode: '',
      token: undefined,
      selectedTypes: [],
      selectedCountries: [],
      gender: ''
    }
    parameters.diseaseCode = request.query.disease
    if(request.query.token) {
      parameters.token = request.query.token
    }
    if(request.query.types) {
      parameters.selectedTypes = convertObjectToArray(request.query.types)
    }
    if(request.query.countries) {
      parameters.selectedCountries = convertObjectToArray(request.query.countries)
    }
    if(request.query.genders) {
      parameters.gender = convertObjectToArray(request.query.genders)
    }
    if(request.query.ageThisYear){
      parameters.ageThisYear = convertObjectToArray(request.query.ageThisYear)
    }
    if(request.query.symptomOnset){
      parameters.symptomOnset = convertObjectToArray(request.query.symptomOnset)
    }
    if(request.query.ageAtDiagnoses){
      parameters.ageAtDiagnoses = convertObjectToArray(request.query.ageAtDiagnoses)
    }
    if(request.query.hierarchy){
      parameters.hierarchy = convertObjectToArray(request.query.hierarchy)
    }
    return parameters
  } catch(exception) {
    logger.error("Error extractQueryParameters(): ", exception)
    console.error("Error extractQueryParameters(): ", exception)
  }
}

module.exports.normalizePort = (val) => {
  try {
    const port = parseInt(val, 10)
    if (isNaN(port)) {
      return val
    } 
    if (port >= 0) {
      return port
    }
    return false
  } catch (exception) {
    logger.error("Error normalizePort(): ", exception)
    console.error("Error normalizePort(): ", exception);
  }
}