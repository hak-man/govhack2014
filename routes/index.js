var express = require('express');
var router = express.Router();
var Handlebars = require('handlebars');

/* GET home page. */
router.get('/', function(req, res) {
	res.render('home', {
		data:[
			{name:'A', value:3},
			{name:'B', value:4},
			{name:'C', value:2},
			{name:'D', value:1}
			],
		numbers:[2,7,4,1],

		helpers: {
            foo: function () { return new Handlebars.SafeString('<h1>foo.</h1>'); }
        }
	});
});

module.exports = router;