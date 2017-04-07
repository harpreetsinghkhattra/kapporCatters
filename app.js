var express = require('express');
var path = require('path');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;// var favicon = require('serve-favicon');
// var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var multer = require('multer');
var expressSession = require('express-session');
var fs = require('fs');
var app = express(); 
var port = process.env.PORT || 3000;

// data base 
var client = require('mongodb').MongoClient;
var assert = require('assert');

function database(callback){
    var url = "mongodb://localhost:27017/cook";
    client.connect(url, function(err, db){
        callback(err, db);
    });
}

function profileinfo(profile){
    console.log('here is begining of our profileinfo method', profile);
    if(profile !== undefined && profile.length !== 0){
      console.log('profile is valid');
      database(function(err, db){
        var collection = db.collection('comment');
            collection.find({}).sort({$natural:-1}).limit(1).toArray(function(err, data){
              if(err) throw err;
              if(data && data.length !== 0){
                console.log('data length is not empkaty ok all right!........', parseInt(data[0].id)+1)
                 collection.insert({
              "id" : data[0].id+1,
              "profile_id" : profile.id,
              "comment" : 'Empty Message',
              "createdTime" : new Date().toDateString(),
              "status" : 1,
              'image' : profile.photos[0].value 
            }).then(function(response){
              if(response.result.ok === 1){
                collection.find({}).toArray(function(err, d){
                  if(err) throw err;
                  if(d){ console.log(d)
                    console.log('ok too')};
                })
              }else{
                        console.log('here response is different see', response);
              }
            }); 
      }else{
              console.log('data length is not empkaty ok all right!........')

           collection.insert({
            "id" : 1,
            "profile_id" : profile.id,
            "comment" : 'Empty Message',
            "createdTime" : new Date().toDateString(),
            "status" : 1,
            'image' : profile.photos[0].value 
          }).then(function(response){
            if(response.result.ok === 1){
              collection.find({}).toArray(function(err, d){
                if(err) throw err;
                if(d){ console.log(d)
                  console.log('ok too')};
              })
            }else{
                      console.log('here response is different see', response);
            }
          });
        }
      });
      });
    }else{
      console.log('profile view is empty');
    }
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({
    secret : 'saasla',
    resave : true,
    saveUninitialized: true
}));

//------------------------------------------------------------------------------------
// Passport session setup.
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

//main user fetching method
passport.use(new FacebookStrategy({
    clientID : '209329226221250',
    clientSecret : '380e975b9ba270a84221cd7cbab73d5c' ,
    callbackURL : "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)']
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      //Check whether the User exists or not using profile.id
      //Further DB code.
     console.log('hello//////////////////////////////////',profile.photos[0].value);
     profileinfo(profile);
      return done(null, profile);
    });
  }
));
//------------------------------------------------------------------------------------

//app.use(multer());
app.use(express.static(path.join(__dirname)));

// for parsable files
app.get('/', function(req, res){
        database(function(err, db){
      if(err) throw err;
          var collection = db.collection('comment');
        collection.remove({comment : 'Empty Message'})
    })
        res.render('index', { user: req.user });
        res.end();
});

//------------------------------ SET AND GET MESSAGES ---------------------------------


app.post('/check', function(req, res){
        if(parseInt(req.session.id) === 1){
          console.log(1,'lllllllllllllllllllllllll')
          res.send(1);
          res.end();
        }else if(parseInt(req.session.id) === 0){
                    console.log(0, 'lllllllllllllllllllllllll')
          res.send(0);
          res.end();
        }else if(req.session.id === undefined){
                    console.log('u' ,'llllllllllllllllllllllllllll')
          res.send('not defined');
          res.end();
        }else{
        console.log(req.session.id);
          res.send('waht');
          res.end();
        }
});

app.get('/login', function(req , res){
        res.render('loginSuccess', { user: req.user });
        res.end();
})

app.get('/errorOccured:id', function(req, res){
  res.render('error', {user : req.user})
  res.end();
})

app.post('/setMessage', function(req, res){
  console.log('here i am initailaze ok al it is', req.body.message);
  database(function(err, db){
      if(err) throw err;
          var collection = db.collection('comment');
      collection.find({comment : 'Empty Message'}).sort({$natural:-1}).limit(1).toArray(function(err, data){
        if(err) throw err;
        if(data && data.length !== 0){
          collection.update({id : data[0].id}, {$set : {comment : req.body.message}})
          res.json('ok');
          res.end();
        }else{
          res.json('No Comment Is Not Updated!');
          res.end();
        }
      })
    })
});

app.post('/getLastUpdatedMessage', ensureAuthenticated, function(req, res){
  database(function(err, db){
      if(err) throw err;
          var collection = db.collection('comment');
      collection.find({}).sort({$natural:-1}).limit(1).toArray(function(err, data){
        if(err) throw err;
        if(data && data.length !== 0){
          res.json(data);
          res.end();
        }else{
          res.json('No Comment Is Not Updated!');
          res.end();
        }
      })
    })
});

app.post('/getMessage', function(req, res){
  console.log('lllllllllllllllllllllllllllllllllllllllllllllllllll', req.body.count);
  database(function(err, db){
    if(err) throw err;
        var collection = db.collection('comment');
    collection.find({}).sort({$natural:-1}).limit(parseInt(req.body.limit)).skip(parseInt(req.body.count)).toArray(function(err, data){ //
      if(err) throw err;
      if(data && data.length !== 0){
        res.json(data);
        res.end();
      }else{
        res.json('No Comment Is Available!');
        res.end();
      }
    })
  })
})


//-------------------------------------------------------------------------------------

// app.get(/.*.\w{2,4}$/, function(req, res){
//     console.log('here is your path:',path.join(__dirname,req.url));
//     res.sendFile(path.join(__dirname,req.url));
// })

//Passport Router
app.get('/auth/facebook', passport.authenticate('facebook', {scope : ['email']}));
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { 
       successRedirect : '/login?id=1', 
       failureRedirect: '/errorOccured?id=0' 
  }),
  function(req, res) {
    res.redirect('/');
  });
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.json('ok auth');
  next();
}

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

app.listen(port, function(){
	console.log('port is listening!.......');
});
