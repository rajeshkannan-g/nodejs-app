var path = require('path');


function logFormat() {
    if (process.env.NODE_ENV == 'production')
        return 'tiny';
    else
        return 'dev';
}

function skipLogging(req, res) {
    return process.env.NODE_ENV == 'production' && res.statusCode < 400;
}

module.exports = {
    logPath: path.dirname(require.main.filename) + '/access.log',
    format: logFormat(),
    skip: skipLogging
}
