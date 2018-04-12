const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

module.exports = function (app) {
    var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
    if (app)
        app.use(morgan('combined', {
            stream: accessLogStream
        }))

    return morgan;
}