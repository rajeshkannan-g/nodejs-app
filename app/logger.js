const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const loggerConfig = require('./config/logger_config');

module.exports = function (app) {
    var accessLogStream = fs.createWriteStream(path.join(loggerConfig.logPath), { flags: 'a' });
    if (app)
        app.use(morgan(loggerConfig.format, {
            stream: accessLogStream,
            skip: loggerConfig.skip
        }))

    return morgan;
}