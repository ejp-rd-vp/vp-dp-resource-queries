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
const { executeHierarchyQuery } = require("./queries/hierarchyQueries");


const convertResourceResponsesToArray = (resource) => {
  if (resource.resourceResponses.constructor.name !== "Array") {
    resource.resourceResponses = [resource.resourceResponses]
  }
  return resource
};

const filterResourceTypes = (allResources, expectedResourceTypes) => {
  return allResources.filter(resource => {
    if (expectedResourceTypes.some(r =>
        resource.resourceType.indexOf(convertResourceTypeSyntax(r)) > -1)
        || resource.resourceType.indexOf('catalogue') > -1) {
      return resource
    }
  })
};

const convertResourceTypeSyntax = (resourceType) => {
  if (resourceType === 'PatientRegistryDataset') {
    return 'patientRegistry'
  } else if (resourceType === 'BiobankDataset') {
    return 'bioBank'
  } else if (resourceType === 'KnowledgeDataset') {
    return 'knowledgeBase'
  }
  return null;
};

const getPercentageUpTo = (percentage) => {
  return Math.floor(Math.random() * percentage) / 100
};

const convertObjectToArray = (obj) => {
  if (obj.constructor.name !== "Array") {
    return [obj]
  }
  return obj
};

const extractOrphacode = (str) => {
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

const getSources = async () => {
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

const withTimeout = (millis, promise) => {
  const timeout = new Promise((resolve, reject) =>
      setTimeout(
          () => resolve(null),
          millis));
  return Promise.race([
    promise,
    timeout
  ]);
};

const extractQueryParameters = async (request) => {
  try {
    let parameters = {
      diseaseCodes: [],
      token: undefined,
      selectedTypes: [],
      selectedCountries: [],
      gender: []
    }
    if (request.query.hierarchy) {
      parameters.hierarchy = convertObjectToArray(request.query.hierarchy)
    }
    if (request.query.diseases) {
      parameters.diseaseCodes = convertObjectToArray(request.query.diseases)
      parameters.diseaseCodes = parameters.diseaseCodes.map(code => 'Orphanet_' + code)
    }
    if (request.query.token) {
      parameters.token = request.query.token
    }
    if (request.query.types) {
      parameters.selectedTypes = convertObjectToArray(request.query.types)
    }
    if (request.query.countries) {
      parameters.selectedCountries = convertObjectToArray(request.query.countries)
    }
    if (request.query.genders) {
      parameters.gender = convertObjectToArray(request.query.genders)
    }
    if (request.query.ageThisYear) {
      parameters.ageThisYear = convertObjectToArray(request.query.ageThisYear)
    }
    if (request.query.symptomOnset) {
      parameters.symptomOnset = convertObjectToArray(request.query.symptomOnset)
    }
    if (request.query.ageAtDiagnoses) {
      parameters.ageAtDiagnoses = convertObjectToArray(request.query.ageAtDiagnoses)
    }
    return parameters
  } catch (exception) {
    logger.error("Error extractQueryParameters(): ", exception)
    console.error("Error extractQueryParameters(): ", exception)
  }
}

const normalizePort = (val) => {
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

module.exports = { withTimeout, convertResourceResponsesToArray, normalizePort, extractQueryParameters, getSources, extractOrphacode, filterResourceTypes, convertObjectToArray }