var express = require('express');
var config  = require('../../config/core');
var util    = require('../../util/core');
var router = express.Router();


router.get('/', util.ensureAuthenticated, function(req, res, next) {
  res.render('kanri/stream', {title: config.SITE_NAME + ' · Stream', config: config});
});

module.exports = router;