var express = require('express');
var path = require('path');

// Loads the various route files
var routes = require('./routes/index');
var about = require('./routes/about');
var handlebars = require('express3-handlebars').create({defaultLayout: 'main'});

var app = express();
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// Specifies a path for static files and views for client side
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

// Defines the routes to use given the URL path
app.use('/', routes);
app.use('/about', about);

// custom 404 page
app.use(function(req, res) {
	res.status(404);
	res.render('404');
});

// custom 500 page
app.use(function(req, res) {
	res.status(500);
	res.render('500');
});

module.exports = app;