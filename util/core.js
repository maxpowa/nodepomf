var config = require('../config/core');
var path = require('path');
var crypto = require("crypto");
var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database(config.DB_FILENAME);
db.exec('CREATE TABLE IF NOT EXISTS users (id integer primary key, provider text, username text, displayName text, profileUrl text, permissions text)');

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(searchString, position) {
        var subjectString = this.toString();
        if (position === undefined || position > subjectString.length) {
            position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };
}

function generate_name(file, db, cb) {
    var ext = path.extname(file.originalname).toLowerCase();
    // Check if extension is a double-dot extension and, if true, override $ext
    var revname = reverse(file.originalname.toLowerCase());
    config.COMPLEX_EXTS.forEach(function(extension) {
        extension = reverse(extension.toLowerCase());
        if (revname.indexOf(extension) === 0) {
            ext = reverse(extension);
        }
    });

    function gen_name_internal() {
        var name = randomString(config.KEY_LENGTH);
        // Add the extension to the file name
        if (ext !== undefined && ext !== null && ext !== '')
            name = name + ext;
        // Check if a file with the same name does already exist in the database
        db.get('SELECT COUNT(name) FROM files WHERE filename = ?', name, function(err, row) {
            if (row === undefined || row === null || row['COUNT(name)'] === 0) {
                var now = Math.floor((new Date()).getTime()/1000);
                db.run('INSERT INTO files (originalname, filename, size, created) VALUES (?, ?, ?, ?)', [file.originalname, name, file.size, now]);
                cb(name);
            } else {
                console.warn("Name conflict! (" + name + ")");
                gen_name_internal();
            }
        });
    }
    gen_name_internal();
}

function createOrGetUser(user, callback) {
    db.all('SELECT * FROM users', [], function(err, rows) {
      if (err) console.error('A problem occurred getting the user!');
      if (rows === undefined || rows === null || rows.length === 0) {
        // If this is the first user, give them all permissions
        db.run('INSERT INTO users (id, provider, username, displayName, profileUrl, permissions) VALUES (?, ?, ?, ?, ?, ?)',
              [user.id, user.provider, user.username, user.displayName, user.profileUrl, '*']);
        user.permissions = '*';
        return callback(user);
      } else {
        // If the user is already in the DB return that one, otherwise create one with no permissions
        for (var i=0; i<rows.length; i++) {
          if (rows[i].id == user.id) return callback(rows[i]);
        }
        db.run('INSERT INTO users (id, provider, username, displayName, profileUrl, permissions) VALUES (?, ?, ?, ?, ?, ?)',
              [user.id, user.provider, user.username, user.displayName, user.profileUrl, '']);
        user.permissions = '';
        callback(user);
      }
    });
}

function getAllUsers(callback) {
  db.all('SELECT * FROM users', [], callback);
}

function reverse(s) {
    var o = '';
    for (var i = s.length - 1; i >= 0; i--)
        o += s[i];
    return o;
}

function toObject(array) {
    return array.reduce(function(o, v, i) {
        o[i] = v;
        return o;
    }, {});
}

function randomString(length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}

function fileFilter(req, file, cb) {
    var found = false;
    var error = null;
    config.BANNED_EXTS.forEach(function(ext) {
        if (file.originalname.toLowerCase().endsWith(ext)) {
            found = true;
            error = new Error('File \'' + file.originalname + '\' uses a banned extension.');
            error.status = 403;
        }
    });
    if (found)
        cb(error, false);
    else
        cb(null, true);
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/kanri/login');
}

var exports = module.exports;
exports.reverse = reverse;
exports.toObject = toObject;
exports.fileFilter = fileFilter;
exports.generate_name = generate_name;
exports.ensureAuthenticated = ensureAuthenticated;
exports.createOrGetUser = createOrGetUser;
exports.getAllUsers = getAllUsers;
exports.getDatabase = function() {return db;};
