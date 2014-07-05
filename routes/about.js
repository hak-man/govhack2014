var express = require('express');
var router = express.Router();

/* GET about page. */
router.get('/', function(req, res) {
	res.render('about');
	// You can pass in Json to the template (can be used in the template as {{name}})
	// res.render('about', {name: 'value'});
});

module.exports = router;