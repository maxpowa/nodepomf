var express = require('express');
var multer  = require('multer');
var crypto  = require('crypto');
var fs      = require('fs');
var path    = require('path');
var mkdirp  = require('mkdirp');
var cors    = require('cors');
var config  = require('../config/core');
var util    = require('../util/core');

var db = util.getDatabase();
var router = express.Router();

mkdirp(config.UPLOAD_DIRECTORY);

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

// Override multer default _handleFile to add sha1 hash calculation
storage._handleFile = function _handleFile (req, file, cb) {
  var that = this;

  that.getDestination(req, file, function (err, destination) {
    if (err) return cb(err);

    that.getFilename(req, file, function (err, filename) {
      if (err) return cb(err);

      var hash = crypto.createHash('sha1');
      var finalPath = path.join(destination, filename);
      var outStream = fs.createWriteStream(finalPath);

      file.stream.pipe(outStream);
      outStream.on('error', cb);
      outStream.on('data', function(data) {
          hash.update(data);
      });
      outStream.on('finish', function () {
        cb(null, {
          destination: destination,
          filename: filename,
          path: finalPath,
          hash: hash.digest('hex'),
          size: outStream.bytesWritten
        });
      });
    });
  });
};


// Helper for HTML output
function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return 'n/a';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  if (i === 0) return bytes + ' ' + sizes[i];
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
}


var upload = multer({ storage: storage, limits: {fileSize: config.MAX_UPLOAD_SIZE}, fileFilter: util.fileFilter });

/* Handle CORS pre-flight requests */
router.options('/', cors());

/* POST upload page. */
router.post('/', cors(), upload.array('files[]', config.MAX_UPLOAD_COUNT), function(req, res, next) {
  var files = [];
  req.files.forEach(function(file) {
    db.run('UPDATE files SET size = ? WHERE filename = ?', [file.size, file.filename]);
    files.push({'name': file.originalname, 'url': config.FILE_URL + '/' + file.filename, 'size': file.size, 'hash': file.hash, 'mimetype': file.mimetype});
  });

  var furls = files.map(function(elem){
    return elem.name;
  }).join('\n');
  if (req.query.output == 'gyazo') {
    res.status(200).send(furls);
  } else if (req.query.output == 'text') {
    // Ensure trailing newline because that's a thing
    res.status(200).send(furls + '\n');
  } else if (req.query.output == 'html') {
    var outfiles = files.map(function(file) {
      return {
        name: file.name,
        url: file.url,
        size: bytesToSize(file.size),
        hash: file.hash,
        thumb: /image.*/.test(file.mimetype) ? file.url : 'images/fileicon2.png'
      };
    });
    res.status(200).render('output', { title: config.SITE_NAME + ' · ' + config.TAGLINE, config: config, files: outfiles });
  } else {
    res.status(200).json({ 'success': true, 'files': files });
  }
});

module.exports = router;
