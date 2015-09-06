var express = require('express');
var config  = require('../config/core');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('tools', {config: config});
});

router.get('/sharex', function(req, res, next) {
  res.json({
    "Name": config.SITE_NAME,
    "RequestType": "POST",
    "RequestURL": config.URL + "upload.php",
    "FileFormName": "files[]",
    "Arguments": {},
    "ResponseType": "Text",
    "RegexList": [
      "\"url\":\"(.+?)\""
    ],
    "URL": config.FILE_URL + "$1,1$",
    "ThumbnailURL": "",
    "DeletionURL": ""
  });
});

module.exports = router;
