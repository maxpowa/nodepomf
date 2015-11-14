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

router.post('/perm', ensureAuthenticated, function(req, res, next) {
  var id = req.body.id;
  var perms = req.body.perms;
  if (!id || !perms) {
    return res.status(400).json({error: {code: 400, message: 'Invalid id or permissions specified'}});
  }
  util.setUserPermissions(id, perms, function(err) {
    if (err) {
      return res.status(500).json({error: {code: 500, message: 'An error occurred'}});
    }
    res.status(200).json({id: id, perms: perms});
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated() && (req.user.permissions.indexOf('u') >= 0 || req.user.permissions.indexOf('*') >= 0)) { return next(); }
  res.status(401).json({error: {code: 401, message: 'Not authenticated'}});
}

module.exports = router;
