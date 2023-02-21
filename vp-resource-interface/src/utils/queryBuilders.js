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

const logger = require('./logger')

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

function gendersInString(gendersstring){
    gendersstring = gendersstring.replace("female", "NCIT_C16576");
    gendersstring = gendersstring.replace("male", "NCIT_C20197");
    gendersstring = gendersstring.replace("undetermined", "NCIT_C124294");
    gendersstring = gendersstring.replace("unknown", "NCIT_C17998");
    return gendersstring;
}

module.exports.buildIndividualsBody = (filters) => {
    try {

        let countFilters = Object.keys(filters).length;
        let body = '{"meta": { "apiVersion": "v2.0"},';

        body += '"query":{"filters":[';

        let genderCount = filters.genders.length;
        if(filters.ageThisYear == "") countFilters--;
        if(filters.ageAtDiagnosis == "") countFilters--;
        if (filters.genders != null ) {
            if(filters.genders.includes("female") && filters.genders.includes("male") && filters.genders.includes("undetermined") && filters.genders.includes("undetermined")){
                countFilters--;
            }else {
                if (filters.genders.includes("female")) {
                    body += '{"id": "NCIT_C28421","operator": "=","value": "' + this.gendersInString("female") + '"}';
                    genderCount--;
                    if (genderCount > 1) {
                        body += ",";
                    }
                }
                if (filters.genders.includes("male")) {
                    body += '{"id": "NCIT_C28421","operator": "=","value": "' + this.gendersInString("male") + '"}';
                    genderCount--;
                    if (genderCount > 1) {
                        body += ",";
                    }
                }
                if (filters.genders.includes("undetermined")) {
                    body += '{"id": "NCIT_C28421","operator": "=","value": "' + this.gendersInString("undetermined") + '"}';
                    genderCount--;
                    if (genderCount > 1) {
                        body += ",";
                    }
                }
                if (filters.genders.includes("unknown")) {
                    body += '{"id": "NCIT_C28421","operator": "=","value": "' + this.gendersInString("unknown") + '"}';
                    genderCount--;
                    if (genderCount > 1) {
                        body += ",";
                    }
                }
                countFilters--;
            }
        } if (filters.disease != null) {
            let disCode = ""
            for(let i = 0; i <= filters.disease.length; i++){
              //for(let disease in filters.disease){
                if((filters.disease[i]==",") || (i == filters.disease.length)){
                    body += '{"id": "Orphanet_' + disCode+ '"}';
                    disCode = "";
                    countFilters--;
                    if(filters.disease[i]==",") {
                        body += ",";
                    }
                }else{
                    disCode += filters.disease[i];
                }
            }
        } if (filters.phenotype != null) {
            body += '{"id": "HP_'
            for (let i = 0; i < filters.phenotype.length; i++) {
                body += filters.phenotype[i];
            }
            body += '"}';
            countFilters--;
            if(countFilters > 1){
                body += ",";
            }
        } if (filters.genes != null) {
            body += '{"id": "data_2295","operator": "=","value": "'
            for (let i = 0; i < filters.genes.length; i++) {
                body += filters.genes[i];
            }
            body += '"}';
            countFilters--;
            if(countFilters > 1){
                body += ",";
            }
        } if (filters.ageThisYear != "") {
            body += '{"id": "NCIT_C83164","operator": "=","value": "';
            for (let i = 0; i < filters.ageThisYear.length; i++){
                body += filters.ageThisYear[i]
            }
            body += '"}';
            countFilters--;
            if(countFilters > 1){
                body += ",";
            }
        } else if(filters.ageAtDiseaseManifestation != ""){  //symptomOnset
            body +='{"id": "NCIT_C124353","operator": "=","value": "'
            for(let i = 0; i<filters.ageAtDiseaseManifestation.length; i++) {
                body += filters.ageAtDiseaseManifestation[i];
            }
            body += '"}';
            countFilters--;
            if(countFilters > 1){
                body += ",";
            }
        } if (filters.ageAtDiagnosis != "") {
            body += '{"id": "NCIT_C156420","operator": "=","value": "'
            for(let i = 0; i<filters.ageAtDiagnosis.length; i++) {
                body += filters.ageAtDiagnosis[i];
                //            console.log("filters Age at Diagnosis FOR Schleife "+filters.ageAtDiagnosis)
            }
            body += '"}';
            countFilters--;
            if(countFilters > 1){
                body += ",";
            }
            /* }else if(filters.availableMatrials != null){
                 for(let i = 0; i < filters.disease.length; i++) {
                     body += '{"id": "Available Materials","operator": "=","value": "'+ filters.availableMatrials[i]+ '"}';
                 }
             }else if(filters.id != null){
                 body +='{"id": "id","operator": "=","value": "'+filters.id+'"}';
             }else if(filters.name != null){
                 body +='{"id": "name","operator": "=","value": "'+filters.name+'"}';
             }else if(filters.description != null){
                 body +='{"id": "description","operator": "=","value": "'+filters.description+'"}';
             }else if(filters.organisation != null){
                 body +='{"id": "organisation","operator": "=","value": "'+filters.organisation+'"}';
             }else if(filters.resourceType != null){
                 body +='{"id": "resourceType","operator": "=","value": "'+filters.resourceType+'"}';
             }*/
        }
        body += ']}}'
        return body;
    }catch (exception) {
        console.error("Error in portal.js:buildVivifyNetworkQuery(): ", exception);
    }
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