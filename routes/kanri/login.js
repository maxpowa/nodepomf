var express = require('express');
var config  = require('../../config/core');
var router = express.Router();


router.get('/', function(req, res, next) {
  if (config.GITHUB_CLIENT_ID && config.GITHUB_CLIENT_SECRET) {
    if (req.isAuthenticated()) {
      res.redirect(301, '/stream');
    }
    res.render('kanri/login', {title: config.SITE_NAME + ' · Login', config: config});
  } else {
    next(new Error('Authentication not configured'));
  }
});

module.exports = router;
