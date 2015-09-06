var express = require('express');
var config  = require('../config/core');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('contact', { title: 'NPomf', config: config });
});

module.exports = router;
