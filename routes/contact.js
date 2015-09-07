var express = require('express');
var config  = require('../config/core');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('contact', { title: config.SITE_NAME + ' · Contact', config: config });
});

module.exports = router;
