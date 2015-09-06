var express = require('express');
var config  = require('../config/core');
var path = require('path');
var fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'NPomf', config: config });
});

router.get('/*', function(req, res, next) {
  if (req.params && req.params[0] && fs.existsSync(path.join(config.UPLOAD_DIRECTORY, req.params[0]))) {
    res.sendFile(req.params[0], {root: config.UPLOAD_DIRECTORY});
  } else {
    res.render('error', {
      message:"I'm sorry onii~",
      error: {
        status: 404
      }
    });
  }
});

module.exports = router;
