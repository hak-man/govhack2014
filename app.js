var express = require('express');
var path = require('path');

// Loads the various route files
var routes = require('./routes/index'),
	about = require('./routes/about');
var exphbs = require('express3-handlebars'),
	Handlebars = require('handlebars');
var weather = require('./lib/weather.js');

var hbs = exphbs.create({
  defaultLayout: 'main',
  handlebars: Handlebars
});

var app = express();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Specifies a path for static files and views for client side
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

// Add middleware
app.use(function (req,res,next) {
	if (!res.locals.partials) res.locals.partials = {};
	res.locals.partials.weather = weather.getWeatherData();
	next();
});

// Defines the routes to use given the URL path
app.use('/', routes);
app.use('/about', about);
app.use('/kartograph', function(req, res) {
	res.render('kartograph');
});
app.use('/highmaps', function(req, res) {
    res.render('highmaps');
});

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