var express = require('express');
var config  = require('../config/core');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: config.SITE_NAME + ' · ' + config.TAGLINE, config: config });
});

module.exports = router;
