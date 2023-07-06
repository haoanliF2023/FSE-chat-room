var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'FSE Chat Room' });
});

router.post('/', function(req, res, next) {
  console.log(`index post ${req}`)
});

module.exports = router;
