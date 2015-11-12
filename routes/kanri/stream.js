var express = require('express');
var config  = require('../../config/core');
var util    = require('../../util/core');
var router = express.Router();


router.get('/', util.ensureAuthenticated, function(req, res, next) {
  res.render('kanri/stream', {title: config.SITE_NAME + ' · Stream', config: config, user: req.user});
});

router.get('/uploads', ensureAuthenticated, function(req, res, next) {
  var age = req.query.maxAge; // 1 day
  age = parseInt(age, 10);
  if (!age && age !== 0) {
    return res.status(400).json({error: {code: 400, message: 'Invalid/no age specified'}});
  }
  var now = Math.floor((new Date()).getTime()/1000);
  var since = now - age; 
  util.getUploads(since, function(err, uploads) {
    if (err) {
      return res.status(500).json({error: {code: 500, message: 'An error occurred'}});
    }
    res.status(200).json(uploads);
  });
});

router.post('/delete', ensureAuthenticated, function(req, res, next) {
  var id = req.body.id;
  if (!id) {
    return res.status(400).json({error: {code: 400, message: 'Invalid id specified'}});
  }
  util.deleteFile(id, function(err) {
    if (err) {
      return res.status(500).json({error: {code: 500, message: 'An error occurred'}});
    }
    res.status(200).json({id: id});
  });
});

router.post('/rename', ensureAuthenticated, function(req, res, next) {
  var id = req.body.id;
  var newName = req.body.newName;
  if (!id || !newName || newName.match('^[\\w\\-. ]+$')) {
    return res.status(400).json({error: {code: 400, message: 'Invalid id or new name specified'}});
  }
  util.renameFile(id, newName, function(err, data) {
    if (err) {
      return res.status(500).json({error: {code: 500, message: 'An error occurred'}});
    }
    res.status(200).json(data);
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated() && (req.user.permissions.indexOf('a') >= 0 || req.user.permissions.indexOf('*') >= 0)) { return next(); }
  res.status(401).json({error: {code: 401, message: 'Not authenticated'}});
}

module.exports = router;
