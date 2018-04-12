const express = require('express');
const app = express();

const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', {
  stream: accessLogStream
}));

//Initialize host and port from environment variables
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
  ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

// error handling
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Oops! Something went wrong.');
});

var initApp = function (err) {
  if (err)
    console.error('Error connecting to Mongo. Message:\n' + err);
  else {
    app.use(function (req, res, next) {
      if (req.session && req.session.userId)
        next();
      else
        res.sendFile(path.join(__dirname + '/public/login.html'));
    });

    app.use('/', express.static('public'))

    app.get('/', function (req, res) {
      res.sendFile(path.join(__dirname + '/public/index.html'));
    });
  }
}

const db = require('./modules/db.js')(process, initApp);

app.get('/hi', function (req, res) {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end('Hello there!');
});

app.listen(port, ip, () => console.log('Server running on http://%s:%s', ip, port));

module.exports = app;