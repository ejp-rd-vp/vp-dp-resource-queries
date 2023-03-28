const fetch = require("node-fetch");
const { handleFetchErrors } = require("../handler/errorsHandler");
const logger = require("../logger");
const executeIndividualsQuery = (source, individualsBody) => {
    try{
        const authKey = JSON.parse(process.env.AUTH_KEYS)[source.resourceName];
        return new Promise(async (resolve, reject) => {
            await fetch(`${source.resourceAddress}`, {
                method: 'post',
                headers: {'Accept': 'application/json', 'auth-key': authKey},
                body: JSON.stringify(individualsBody)
            })
                .then(handleFetchErrors)
                .then(async (fetchResponse) => {
                    if (fetchResponse.status >= 200 && fetchResponse.status < 400) {
                        let data = await fetchResponse.json()
                        let returnData = {
                            name: source.resourceName,
                            numTotalResults: data.responseSummary.numTotalResults,
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

module.exports = { executeIndividualsQuery }