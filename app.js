const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const exphbs       = require('express-handlebars');
const favicon      = require('serve-favicon');
const flash        = require('connect-flash');
const logger       = require('morgan');
const passport     = require('passport');
let path           = require('path');
const session      = require('express-session');

const BusRouter  = require('./controller/bus');
const PlaceRouter  = require('./controller/place');

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');

// Set up favicon, logging, parsing, static files
// Uncomment after placing your favicon in public/images/
//app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.set({
    'Allow-Control-Allow-Origin': '*'
  });
  next();
});
// Set up passport strategies and message passing
require('./config/passport')(passport);
app.use(session({
  secret: 'bussecret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// API Routes
app.use('/api/v1/', BusRouter);
app.use('/api/v1/', PlaceRouter);
// Set up routes and pass in configured passport
require('./routes/index.js')(app);
require('./routes/auth.js')(app, passport);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handlers

// Development error handler
// Will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// Production error handler
// No stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
