var config = require('../config/core');
var path = require('path');
var crypto = require("crypto");

function generate_name(file, db, cb) {
  var ext = path.extname(file.originalname)
	// Check if extension is a double-dot extension and, if true, override $ext
	var revname = reverse(file.originalname);
	config.COMPLEX_EXTS.forEach(function(extension) {
    extension = reverse(extension);
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
		db.get('SELECT COUNT(name) FROM pomf WHERE name = ?', name, function(err, row) {
      if (row === undefined || row === null || row['COUNT(name)'] === 0) {
        console.log(file);
        db.run('INSERT INTO pomf (originalname, name, size) VALUES (?, ?, ?)', [file.originalname, name, file.size]);
        cb(name);
      } else {
        console.warn("Name conflict! (" + name + ")")
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

var exports = module.exports;
exports.reverse = reverse;
exports.toObject = toObject;
exports.generate_name = generate_name;
