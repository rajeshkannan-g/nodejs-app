const express = require('express');
const app = express();


const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('./app/logger')(app);
const db = require('./app/db.js');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo')(session);

var initApp = function () {

  require('./app/authentication')(passport);
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({extended: false}));
  
  app.use(session({
    secret: 'vmlpuram',
    name: 'nodejs-app',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
      mongooseConnection: db.connection,
      ttl: 2 * 24 * 60 * 60
    })
  }));
  
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash())
  
  app.set('view engine', 'ejs');

  var router = require('./app/router');
  app.use('/', router);
  console.log('Initialized application.');
}

if (db.connection.readyState != 1)
  db.connection.on('connected', initApp);
else
  initApp();

app.get('/pagecount', function (req, res) {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end('Hello there!');
});

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
  ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.listen(port, ip, () => console.log(`Server running on http://${ip}:${port}`));

module.exports = app;