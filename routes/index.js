const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const db = require('../db');
const router = express.Router();

passport.serializeUser((user, done) => {
  process.nextTick(function() {
    done(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser((user, done) => {
  process.nextTick(function() {
    return done(null, user);
  });
});

passport.use(
  new LocalStrategy(
    (username, password, done) => {
      console.log(username);
      console.log(password);
      if (!username || !password) {
        done(new Error('Missing credentials1'), null);
      }
      // find user in db
      db.get('SELECT * FROM users WHERE username = ?', [ username ], function(err, row) {
        if (err) { return done(err); }
        if (!row) { return done(null, false, { message: 'Incorrect username or password.' }); }

        crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
          if (err) { return done(err); }
          if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
            return done(null, false, { message: 'Incorrect username or password.' });
          }
          return done(null, row);
        });
      });
    }
  )
);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'FSE Chat Room' });
});

router.post('/authenticate', passport.authenticate('local'), (req, res) => {
  console.log("logged in");
  res.redirect("/chat");
});

module.exports = router;
