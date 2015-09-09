var express = require('express');
var multer  = require('multer');
var mkdirp = require('mkdirp');
var config  = require('../config/core');
var util    = require('../util/core');
var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database(config.DB_FILENAME);
var router = express.Router();

mkdirp(config.UPLOAD_DIRECTORY);

db.run('CREATE TABLE IF NOT EXISTS files (id integer primary key, filename text unique, originalname text, size number)');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.UPLOAD_DIRECTORY);
  },
  filename: function (req, file, cb) {
    util.generate_name(file, db, function(name){
      cb(null, name);
    });
  }
});

var upload = multer({ storage: storage, limits: {fileSize: config.MAX_UPLOAD_SIZE}, fileFilter: util.fileFilter });

/* POST upload page. */
router.post('/', upload.array('files[]', config.MAX_UPLOAD_COUNT), function(req, res, next) {
  var files = [];
  req.files.forEach(function(file) {
    db.run('UPDATE files SET size = ? WHERE filename = ?', [file.size, file.filename]);
    files.push({"name": file.originalname, "url": file.filename, "size": file.size});
  });
  files = util.toObject(files);
  res.status(200).json({'success': true, 'files': files});
});

module.exports = router;
