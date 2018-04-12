const mongodb = require('mongodb');

var db = null;

module.exports = function (process, callback) {

    var mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL;

    if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
        var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
            mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
            mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
            mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
            mongoPassword = process.env[mongoServiceName + '_PASSWORD']
        mongoUser = process.env[mongoServiceName + '_USER'];

        if (mongoHost && mongoPort && mongoDatabase) {
            mongoURL = 'mongodb://';
            if (mongoUser && mongoPassword) {
                mongoURL += mongoUser + ':' + mongoPassword + '@';
            }
            mongoURL += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
        }
    }

    if (mongoURL == null || mongodb == null)
        return;

    mongodb.connect(mongoURL, { poolSize: 10 }, function (err, conn) {
        if (err) {
            console.error(err);
            if(callback)
                callback(err);
            return;
        }
        db = conn;
        console.log('Connected to MongoDB at: %s', mongoURL);
        if(callback)
            callback();
    });
    return db;
}