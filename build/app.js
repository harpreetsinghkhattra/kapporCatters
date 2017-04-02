var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var multer = require('multer');
var expressSession = require('express-session');
var fs = require('fs');
var crud = require('./operations.js');
 
var routes = require('./route.js');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({
    secret : 'saasla',
    resave : true,
    saveUninitialized: true
}));
//app.use(multer());
app.use(express.static(path.join(__dirname)));

// for parsable files
app.get(/.*.\w{2,4}$/, function(req, res){
    console.log('here is your path:',path.join(__dirname,req.url));
    res.sendFile(path.join(__dirname,req.url));
})

app.use('/create', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, function(){
	console.log('port is listening!.......');
});