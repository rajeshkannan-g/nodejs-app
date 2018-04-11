const fs = require('fs');
const path = require('path');
const express = require('express');
const app     = express();
const morgan  = require('morgan');

//Setup Access Logging
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})
app.use(morgan('combined', {
  stream: accessLogStream
}))

//Initialize host and port from environment variables
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL;

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
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;
  }
}

if(mongoURL == null)
  mongoURL = "mongodb://admin:admin@127.0.0.1:27017/application";

global.db = null;

var initDb = function(callback) {
  if (mongoURL == null) return;

  var mongodb = require('mongodb');
  if (mongodb == null) return;

  mongodb.connect(mongoURL, {poolSize: 10}, function(err, conn) {
    if (err) {
      callback(err);
      return;
    }
    db = conn;
    console.log('Connected to MongoDB at: %s', mongoURL);
  });
};

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Oops! Something went wrong.');
});

initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});

app.get('/', function (req, res) {
    res.send('Yup! Its working' + (!global.db ? ', but no db though :(':''));
});

app.listen(port, ip, () => console.log('Server running on http://%s:%s', ip, port));

module.exports = app;