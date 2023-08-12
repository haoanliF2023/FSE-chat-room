const sqlite3 = require('sqlite3');
const crypto = require('crypto');

var db = new sqlite3.Database('chat.db');

db.serialize(function() {
  // create user table
  db.run("CREATE TABLE IF NOT EXISTS users ( \
    id INTEGER PRIMARY KEY, \
    username TEXT UNIQUE, \
    hashed_password BLOB, \
    salt BLOB \
  )");

  // create message table
  db.run("CREATE TABLE IF NOT EXISTS messages ( \
    id INTEGER PRIMARY KEY, \
    user_id INTEGER NOT NULL, \
    message TEXT NOT NULL, \
    time TIME \
  )");

  // create an initial user
  var salt = crypto.randomBytes(16);
  db.run('INSERT OR IGNORE INTO users (username, hashed_password, salt) VALUES (?, ?, ?)', [
    'lori',
    crypto.pbkdf2Sync('haha', salt, 310000, 32, 'sha256'),
    salt
  ]);
});

module.exports = db;
