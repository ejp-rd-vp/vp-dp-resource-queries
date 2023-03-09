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
const executeHierarchyQuery = require('./queries').executeHierarchyQuery
const logger = require('./logger')
const GENDER_ID = 'NCIT_C28421'
const AGE_THIS_YEAR_ID = 'NCIT_C83164'
const SYMPTOM_ONSET_ID = 'NCIT_C124353'
const AGE_AT_DIAGNOSIS = 'NCIT_C156420'

module.exports.buildCatalogueQuery = (address, searchTerm, types, countries) => {
    try {
        let query = `${address}resource/search?code=http://www.orpha.net/ORDO/Orphanet_${searchTerm}`
        for(let type of types) {
            if(type == "KnowledgeDataset") {
                continue
            }
            query+= `&resourceType=${type}`;
        }
        for(let country of countries) {
            query+= `&country=${country}`;
        }
        return query
    } catch (exception) {
        logger.error("Error in buildCatalogueQuery(): ", exception)
        console.error("Error in buildCatalogueQuery(): ", exception);
    }
}

const genderToGenderId = (gender) => {
    if (gender === 'female') {
        return 'NCIT_C16576'
    } else if (gender === 'male') {
        return 'NCIT_C20197'
    } else if (gender === 'undetermined') {
        return 'NCIT_C124294'
    } else if (gender === 'unknown') {
        return 'NCIT_C17998'
    }
    return '';
};

module.exports.buildIndividualsBody = async (filters) => {
    let body = {meta: {apiVersion: "v2.0"}, query: {filters: []}}
    if (filters.gender && filters.gender.length > 0 && filters.gender.length !== 4) {
        for (let gen of filters.gender) {
            body.query.filters.push({id: GENDER_ID, operator: '=', value: genderToGenderId(gen)})
        }
    }
    let diseaseCodes = []
    if (filters.diseaseCode) {
        if (filters.hierarchy) {
            if (filters.hierarchy.includes('up')) {
                const orphaCodesUp = await executeHierarchyQuery(filters.diseaseCode, 'up')
                if (orphaCodesUp) {
                    diseaseCodes.push(...orphaCodesUp);
                }
            }
            if (filters.hierarchy.includes('down')) {
                const orphaCodesdown = await executeHierarchyQuery(filters.diseaseCode, 'down')
                if (orphaCodesdown) {
                    diseaseCodes.push(...orphaCodesdown);
                }
            }
            diseaseCodes.push('Orphanet_' + filters.diseaseCode)
            body.query.filters.push({id: diseaseCodes})
        }
        body.query.filters.push({id: 'Orphanet_' + filters.diseaseCode})
    }
    if (filters.phenotype) {
    }  // TODO
    if (filters.genes) {
    } // TODO
    if (filters.ageThisYear) {
        body.query.filters.push({id: AGE_THIS_YEAR_ID, operator: '>=', value: filters.ageThisYear[0]})
        body.query.filters.push({id: AGE_THIS_YEAR_ID, operator: '<=', value: filters.ageThisYear[1]})
    }
    if (filters.symptomOnset) {
        body.query.filters.push({id: SYMPTOM_ONSET_ID, operator: '>=', value: filters.symptomOnset[0]})
        body.query.filters.push({id: SYMPTOM_ONSET_ID, operator: '<=', value: filters.symptomOnset[1]})
    }
    if (filters.ageAtDiagnoses) {
        body.query.filters.push({id: AGE_AT_DIAGNOSIS, operator: '>=', value: filters.ageAtDiagnoses[0]})
        body.query.filters.push({id: AGE_AT_DIAGNOSIS, operator: '<=', value: filters.ageAtDiagnoses[1]})
    }
    if (filters.availableMatrials) {} // TODO
    return body
}


module.exports.buildBeaconBody = (parameters) => {
    try {
        let body = '';
        if(parameters.gender != '' && parameters.maxAge == '' && parameters.minAge == '') {
        body = {
            "meta": {
                "apiVersion": "2.0"
            },
            "query": {
                "filters": [
                    {
                        "id": `ORPHA:${parameters.diseaseCode}`,
                        "includeDescendantTerms": true,
                        "similarity": "exact",
                        "scope": "individuals"
                    },
                    {
                        "id": "gender",
                        "operator": "=",
                        "value": parameters.gender
                    }                    
                ]
            }
        }
        }
        else if(parameters.minAge != '' && parameters.maxAge != '' && parameters.gender == '') {
        body = {
            "meta": {
                "apiVersion": "2.0"
            },
            "query": {
                "filters": [
                    {
                        "id": `ORPHA:${parameters.diseaseCode}`,
                        "includeDescendantTerms": true,
                        "similarity": "exact",
                        "scope": "individuals"
                    },
                    {
                        "id": "age",
                        "operator": ">=",
                        "value": parameters.minAge
                    },                      
                    {
                        "id": "age",
                        "operator": "<=",
                        "value": parameters.maxAge
                    }
                ]
            }
        }
        }
        else if(parameters.gender != '' && parameters.minAge != '' && parameters.maxAge != '') {
        body = {
            "meta": {
                "apiVersion": "2.0"
            },
            "query": {
                "filters": [
                    {
                        "id": `ORPHA:${parameters.diseaseCode}`,
                        "includeDescendantTerms": true,
                        "similarity": "exact",
                        "scope": "individuals"
                    },
                    {
                        "id": "gender",
                        "operator": "=",
                        "value": parameters.gender
                    },
                    {
                        "id": "age",
                        "operator": ">=",
                        "value": parameters.minAge
                    },                      
                    {
                        "id": "age",
                        "operator": "<=",
                        "value": parameters.maxAge
                    }
                ]
            }
        }
        }
        else if(parameters.gender != '' && parameters.minAge != '' && parameters.maxAge == '') {
        body = {
            "meta": {
                "apiVersion": "2.0"
            },
            "query": {
                "filters": [
                    {
                        "id": `ORPHA:${parameters.diseaseCode}`,
                        "includeDescendantTerms": true,
                        "similarity": "exact",
                        "scope": "individuals"
                    },
                    {
                        "id": "gender",
                        "operator": "=",
                        "value": parameters.gender
                    },
                    {
                        "id": "age",
                        "operator": ">=",
                        "value": parameters.minAge
                    }
                ]
            }
        }
        }
        else if(parameters.gender != '' && parameters.minAge == '' && parameters.maxAge != '') {
        body = {
            "meta": {
                "apiVersion": "2.0"
            },
            "query": {
                "filters": [
                    {
                        "id": `ORPHA:${parameters.diseaseCode}`,
                        "includeDescendantTerms": true,
                        "similarity": "exact",
                        "scope": "individuals"
                    },
                    {
                        "id": "gender",
                        "operator": "=",
                        "value": parameters.gender
                    },
                    {
                        "id": "age",
                        "operator": "<=",
                        "value": parameters.maxAge
                    }
                ]
            }
        }
        }
        else if(parameters.gender == '' && parameters.minAge == '' && parameters.maxAge != '') {
        body = {
            "meta": {
                "apiVersion": "2.0"
            },
            "query": {
                "filters": [
                    {
                        "id": `ORPHA:${parameters.diseaseCode}`,
                        "includeDescendantTerms": true,
                        "similarity": "exact",
                        "scope": "individuals"
                    },
                    {
                        "id": "age",
                        "operator": "<=",
                        "value": parameters.maxAge
                    }
                ]
            }
        }
        }
        else if(parameters.gender == '' && parameters.minAge != '' && parameters.maxAge == '') {
        body = {
            "meta": {
                "apiVersion": "2.0"
            },
            "query": {
                "filters": [
                    {
                        "id": `ORPHA:${parameters.diseaseCode}`,
                        "includeDescendantTerms": true,
                        "similarity": "exact",
                        "scope": "individuals"
                    },
                    {
                        "id": "age",
                        "operator": ">=",
                        "value": parameters.minAge
                    }
                ]
            }
        }
        }
        else {
        body = {
            "meta": {
                "apiVersion": "2.0"
            },
            "query": {
                "filters": [
                    {
                        "id": `ORPHA:${parameters.diseaseCode}`,
                        "includeDescendantTerms": true,
                        "similarity": "exact",
                        "scope": "individuals"
                    }                   
                ]
            }
        }
        }
        return body;
    } catch (exception) {
        logger.error("Error in buildBeaconBody(): ", exception)
        console.error("Error in buildBeaconBody(): ", exception);
    }
}