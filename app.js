var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
var session = require('express-session');
var passport = require('passport');

//モデルの読み込み
var User = require('./models/user');
var Novel = require('./models/novel')
var Question = require('./models/question');
var Comment = require('./models/comment');
var Evaluation = require('./models/evaluation');

//テーブルの作成
User.sync().then(() => {
  Novel.belongsTo(User, {foreignKey: 'createdBy'});
  Novel.sync().then(() => {
    Question.belongsTo(Novel,{foreignKey: 'novelId'});
    Question.sync().then(() => {
      Comment.belongsTo(Question, {foreignKey: 'questionId'});
      Comment.sync().then(() => {
        Evaluation.belongsTo(Comment,{ foreignKey: 'commentId'});
        Evaluation.sync();
      });
    });
  });
});

var GitHubStrategy = require('passport-github2').Strategy;
var GITHUB_CLIENT_ID = '2f831cb3d4aaXXXXXXXXX';
var GITHUB_CLIENT_SECRET = '9fbc340ac0175123695d2dedfbdf5aXXXXXXXXX';
var TwitterStrategy = require('passport-twitter').Strategy;
var CONSUMER_KEY = process.env.CONSUMER_KEY || 'GpCgDxYLAG6VFMAplal4wZsJg';
var CONSUMER_SECRET = process.env.CONSUMER_SECRET || 'wrnCGBrj6F5Fu6lW1WhB05wZc278bEVAPGwpLRfntdjufXtqg3';

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});


passport.use(new TwitterStrategy({
  consumerKey: CONSUMER_KEY,
  consumerSecret: CONSUMER_SECRET,
  callbackURL: process.env.HEROKU_URL ? process.env.HEROKU_URL + 'auth/twitter/callback' : 'http://localhost:8000/auth/twitter/callback'
},
  function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      User.upsert({
        userId: profile.id,
        username: profile.username
      }).then(() => {
        done(null, profile);
      });
    });
  }
));

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var novelsRouter = require('./routes/novels');

var app = express();
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: '3e0a48fc22f3f513', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/novels', novelsRouter);

app.get('/auth/twitter',
  passport.authenticate('twitter'));

app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
