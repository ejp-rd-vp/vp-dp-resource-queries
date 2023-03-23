"use strict"

const fetch = require("node-fetch");
const { handleFetchErrors } = require("../handler/errorsHandler");
const logger = require("../logger");
const executeHierarchyQuery = (code, way, levels) => {
    try {
        const query = 'http://155.133.131.171:8080/ClassifTraversal/hierarchies/traverse?code=' + code + '&way=' + way
        levels = levels.map(level => parseInt(level))
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
                                if (parent.level >= levels[0] && parent.level <= levels[1]) {
                                    for (let parentParent of parent.parents) {
                                        parentParent.level = parent.level
                                        parentParent.way = 'up'
                                        orphaCodes.push(parentParent)
                                    }
                                }
                            }
                        }
                        if (way.toLowerCase() === 'down') {
                            for (let child of contentTemp.childs) {
                                if (child.level >= levels[0] && child.level <= levels[1]) {
                                    for (let childChild of child.childs) {
                                        childChild.level = child.level
                                        childChild.way = 'down'
                                        orphaCodes.push(childChild)
                                    }
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

module.exports = { executeHierarchyQuery }