const mongoose = require('mongoose');
const dbConfig = require('./config/db_config');

mongoose.connect(dbConfig.dbURL, dbConfig.dbOptions, function (err, conn) {
    if (err) {
        console.error(err);
        return;
    }
    console.log(`Connected to MongoDB at: ${dbConfig.dbURL}`);
});

module.exports = mongoose;
