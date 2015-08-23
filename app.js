var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var methodOverride = require('method-override');


var routes = require('./routes/index');
var about = require('./routes/about');
var login = require('./routes/login');
var logout = require('./routes/logout');
var signup = require('./routes/signup');
var user_account = require('./routes/user_account');
var deposit = require('./routes/deposit');
var withdraw = require('./routes/withdraw');
var history = require('./routes/history');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(methodOverride('_method')); // use PUT and DELETE
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
app.use(cookieParser());
app.use(session({secret: 'mysecrethere',saveUninitialized: true, resave: false,}));
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', routes);
app.use('/about', about);
app.use('/login', login);
app.use('/signup', signup);
app.use('/logout', logout);
app.use('/dashboard/user/',user_account);
app.use('/dashboard/deposit/',deposit);
app.use('/dashboard/withdrawal/',withdraw);
app.use('/dashboard/history/',history);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
