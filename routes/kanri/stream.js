var express = require('express');
var config  = require('../../config/core');
var util    = require('../../util/core');
var router = express.Router();


router.get('/', util.ensureAuthenticated, function(req, res, next) {
  res.render('kanri/stream', {title: config.SITE_NAME + ' · Stream', config: config, user: req.user});
});

router.get('/uploads', function(req, res, next) {
  if (req.isAuthenticated()) {
    // TODO
  } else {
    res.json({error: {code: 403, message: 'Not authenticated'}});
  }
});

module.exports = router;
