const winston = require('winston')
const path = require("path")

const logConfiguration = {
    'transports': [
        new winston.transports.Console({
            level: 'info'
        }),
        new winston.transports.File({
            level: 'error',
            filename: path.join(__dirname, '../../logs', 'error.log')
        }),
        new winston.transports.File({
            level: 'info',
            filename: path.join(__dirname, '../../logs', 'combined.log')
        })
    ],
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'MMM-DD-YYYY HH:mm:ss'
        }),
        winston.format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`)
    )
}

const logger = winston.createLogger(logConfiguration)

module.exports = logger