var express = require('express');
var config  = require('../../config/core');
var util    = require('../../util/core');
var router = express.Router();

router.get('/', util.ensureAuthenticated, function(req, res, next) {
  util.getAllUsers(function(err, users) {
    if (req.user.permissions.indexOf('u') < 0 && req.user.permissions.indexOf('*') < 0) {
      users = [req.user];
    }
    res.render('kanri/users', { title: config.SITE_NAME + ' · Users', config: config, user: req.user, users: users });
  });
});

module.exports = router;
