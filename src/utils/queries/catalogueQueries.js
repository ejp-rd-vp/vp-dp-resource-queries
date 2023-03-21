const fetch = require("node-fetch");
const { handleFetchErrors } = require("../handler/errorsHandler");
const logger = require("../logger");
const executeCatalogueQuery = (source, query) => {
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

module.exports = { executeCatalogueQuery }