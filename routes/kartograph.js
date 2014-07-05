var express = require('express');
var router = express.Router();

/* GET kartograph page. */
router.get('/', function(req, res) {
	res.render('kartograph');
});

module.exports = router;