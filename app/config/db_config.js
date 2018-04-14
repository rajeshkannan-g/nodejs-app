var mongoURL = process.env.MONGO_URL || process.env.MONGODB_URI || process.env.OPENSHIFT_MONGODB_DB_URL;

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

if (mongoURL == null)
    return;

var options = {
    bufferCommands: false,
    autoIndex: false,
    reconnectTries: 10,
    reconnectInterval: 500,
    poolSize: 10,
    bufferMaxEntries: 0
};

module.exports = {
    dbURL: mongoURL,
    dbOptions: options
};