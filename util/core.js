var config = require('../config/core');
var path = require('path');
var crypto = require("crypto");

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
                db.run('INSERT INTO files (originalname, filename, size) VALUES (?, ?, ?)', [file.originalname, name, file.size]);
                cb(name);
            } else {
                console.warn("Name conflict! (" + name + ")");
                gen_name_internal();
            }
        });
    }
    gen_name_internal();
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
  res.redirect('/login')
}

var exports = module.exports;
exports.reverse = reverse;
exports.toObject = toObject;
exports.fileFilter = fileFilter;
exports.generate_name = generate_name;
exports.ensureAuthenticated = ensureAuthenticated;
