const logger = require("../logger");
const handleFetchErrors = (fetchResponse) => {
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
};

module.exports = { handleFetchErrors }