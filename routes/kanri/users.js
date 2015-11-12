var express = require('express');
var config  = require('../../config/core');
var util    = require('../../util/core');
var router = express.Router();

router.get('/', util.ensureAuthenticated, function(req, res, next) {
  util.getAllUsers(function(err, users) {
    res.render('kanri/users', { title: config.SITE_NAME + ' · Users', config: config, user: req.user, users: users });
  });
});

module.exports = router;
