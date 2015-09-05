var express = require('express');
var config  = require('../config/core');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'NPomf', config: config });
});

router.get('/*', function(req, res){
    res.sendfile(req.params[0], {root: './files'});
});

module.exports = router;
