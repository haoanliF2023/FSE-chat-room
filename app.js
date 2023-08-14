const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const io = require('socket.io')();
const db = require('./db');

var indexRouter = require('./routes/index');
var chatRouter = require('./routes/chat');

var app = express();
app.io = io;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: "not-actually-secret",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/chat', chatRouter);

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

io.on('connection', (socket) => {
  console.log('a user connected');
  // pull up the chat record
  db.all("SELECT * FROM messages", [], (err, rows) => {
    if (err) {
      throw err;
    } 
    rows.forEach(row => {
      socket.emit('chat message', row.message);
    })
  })
  
  socket.on('chat message', (msg) => {
    // store msg to db
    db.run('INSERT INTO messages (user_id, message, time) VALUES (?, ?, ?)', [
      0, // TODO: use real user id
      msg,
      new Date().toLocaleTimeString()
    ]);
    io.emit('chat message', msg);
  });
});

module.exports = app;
