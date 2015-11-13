var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var passport = require('passport');
var GithubStrategy = require('passport-github2').Strategy;

var routes = require('./routes/index');
var upload = require('./routes/upload');
var tools  = require('./routes/tools');
var faq    = require('./routes/faq');
var contact= require('./routes/contact');
var login  = require('./routes/kanri/login');
var stream = require('./routes/kanri/stream');
var users  = require('./routes/kanri/users');
var config = require('./config/core');
var utils  = require('./util/core');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

var auth = false;
if (config.GITHUB_CLIENT_ID && config.GITHUB_CLIENT_SECRET) {
  auth = true;
  passport.use(new GithubStrategy({
      clientID: config.GITHUB_CLIENT_ID,
      clientSecret: config.GITHUB_CLIENT_SECRET,
      callbackURL: config.URL.replace(/\/$/, '') + "/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      utils.createOrGetUser(profile, function(profile) {
        done(null, profile);
      });
    }
  ));
}


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

if (config.SESSION_OPTIONS['secureProxy'] === true) {
  app.set('trust proxy', 1);
}
app.use(cookieSession(config.SESSION_OPTIONS));

if (auth) {
  app.use(passport.initialize());
  app.use(passport.session());
}

app.use(express.static(path.join(__dirname, 'public')));
app.use('/f', express.static(path.join(__dirname, config.UPLOAD_DIRECTORY)));
app.set('json spaces', 2);

app.use(function(req, res, next) {
  res.locals.grill = config.GRILLS[Math.floor(Math.random()*config.GRILLS.length)];
  next();
});

if (auth) {
  app.use('/kanri/stream', stream);
  app.use('/kanri/users', users);
  app.use('/kanri/login', login);
  app.get('/kanri/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
}

app.use('/upload(.php)?', upload);
app.use('/tools', tools);
app.use('/faq', faq);
app.use('/contact', contact);
app.use('/', routes);

// Authentication functionality
if (auth) {
  var opts = {scope: [ 'user:email' ]};
  app.get('/auth/github',
    passport.authenticate('github', opts),
    function(req, res){
    });

  app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/kanri/stream');
    });
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var error = new Error('Not found');
  error.status = 404;
  next(error);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    var status = err.status || 500;
    res.status(status);
    res.render('error', {
      title: status + ' · ' + err.message,
      message: err.message,
      error: err,
      status: status
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    var status = err.status || 500;
  res.status(status);
  res.render('error', {
    title: status + ' · ' + err.message,
    message: err.message,
    status: status
  });
});


module.exports = app;
