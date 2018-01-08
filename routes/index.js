var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',
  { title: 'Fibonacci Flicks - Search Your Favorite Movies and Shows' });
});

module.exports = router;
