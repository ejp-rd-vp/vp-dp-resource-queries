const fetch = require("node-fetch");
const {handleFetchErrors} = require("./errorsHandler");
const logger = require("../logger");

const userIsAuthenticated = (token) => {
    if (!token) return false
    try{
        const userEndpoint = process.env.AUTH_SERVER_URL + '/realms/' + process.env.AUTH_REALM + '/protocol/openid-connect/userinfo';
        return new Promise(async (resolve, reject) => {
            await fetch(`${userEndpoint}`, {
                method: 'get',
                headers: { 'Authorization': token }
            })
                .then(handleFetchErrors)
                .then(async (fetchResponse) => {
                    if (fetchResponse.status === 200) {
                        resolve(true)
                        console.log(true);
                    } else {
                        resolve(false)
                        console.log(false);
                    }
                })
                .catch((exception) => {
                    resolve(null)
                })
        })
    } catch(exception) {
        logger.error('Error while authenticating user ' + exception)
        console.error("Error while authenticating user ", exception)
    }
}

module.exports = { userIsAuthenticated }