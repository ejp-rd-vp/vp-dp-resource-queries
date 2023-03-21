const fetch = require("node-fetch");
const utils = require("../utils");
const { handleFetchErrors } = require("../handler/errorsHandler");
const logger = require("../logger");

const executeKnowledgeBaseQuery = (source, query) => {
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
                            const content = utils.convertResourceResponsesToArray(contentTemp[0])
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

module.exports = { executeKnowledgeBaseQuery }