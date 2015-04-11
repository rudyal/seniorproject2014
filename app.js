var express = require('express');
var multer  = require('multer');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var session      = require('express-session');
var AnonymousStrategy = require('passport-anonymous').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var moment = require('moment');

//var basic = require('passport-http').Strategy;


// Local
mongoose.connect('mongodb://localhost/forumappdb');

// Heroku
//mongoose.connect('mongodb://rudyal:i70paint@linus.mongohq.com:10046/app30586382');

// models
require('./models/Posts');
require('./models/Comments');
require('./models/Contact');
require('./models/User');
require('./models/ForumType');
require('./models/Expire');
require('./models/ForumCategory');
require('./models/UserForumMeta');

// crons
require('./cron/expire');

// passports
require('./config/passport')(passport); // pass passport for configuration


var app = express();


moment().format();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser({uploadDir:'/public/tmp'}));
app.use(multer({ dest: './public/uploads/'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     User.findOne({ username: username }, function(err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       if (!user.validPassword(password)) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       return done(null, user);
//     });
//   }
// ));

// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function(id, done) {
//   findById(id, function (err, user) {
//     done(err, user);
//   });
// });
//passport.use(new basic());
passport.use(new AnonymousStrategy());
// Setup session for passport
// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// // Add headers
// app.use(function (req, res, next) {

//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     // Pass to next layer of middleware
//     next();
// });


var router = express.Router();
var routes = require('./routes/index');
//var Logroutes = require('./routes/logroutes')(app, passport);
var users = require('./routes/users');

require('./routes/logroutes.js')(app, passport);


// Our routes
app.use('/', routes);

app.use('/users', users);

app.get('/*', function(req, res) {
            res.render('index');
    });
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
