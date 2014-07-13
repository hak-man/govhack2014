// KML Tools
// Requires Node.js
// 
// This package currently provides some KML entity formatters.
//
// Future planned functionality will include KML parsers.
//
// @author Greg Bowering 2014

exports.HTTP_HEADERS = {
  	'Content-Type': 'application/vnd.google-earth.kml+xml',
  	'Access-Control-Allow-Origin': '*'
  	};

// via https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date#Example.3a_ISO_8601_formatted_dates
exports.ISODateString = function ISODateString(d) {
    function pad(n){
        return n<10 ? '0'+n : n
    }
    return d.getUTCFullYear()+'-'
      + pad(d.getUTCMonth()+1)+'-'
      + pad(d.getUTCDate())+'T'
      + pad(d.getUTCHours())+':'
      + pad(d.getUTCMinutes())+':'
      + pad(d.getUTCSeconds())+'Z';
};



// <altitude>:
exports.altitude = function altitude(alt) {
  return '<altitude>' + alt + '</altitude>';
};

// <altitudeMode>: mode is optional, default is 'absolute'
exports.altitudeMode = function altitudeMode(mode) {
  return '<altitudeMode>' + (mode? mode : 'absolute') + '</altitudeMode>\n';
};

// <atom>:
exports.atomAuthorLink = function atomAuthorLink(author, linkHref) {
  return '<atom:author>\n'
    + '  <atom:name>' + author + '</atom:name>\n'
    + '</atom:author>\n' 
    + '<atom:link href="' + linkHref + '" />\n';
};

// <color>:
exports.color = function color(c) {
  return '<color>' + c + '</color>\n';
};

// <coordinates>:
exports.coordinates = function coordinates(bodyContent) {
  return '<coordinates>\n'
      + bodyContent + '\n'
      + '</coordinates>\n';
};

// <description>:
exports.description = function description(desc) {
  return '<description>' + desc + '</description>\n';
};

// <Document>:
exports.document = function document(bodyContent) {
  return '<Document>\n'
    + bodyContent
    + '</Document>\n';
};

// <expires>:
exports.expires = function expires(expiry) {
  return '<expires>' + expiry + '</expires>\n';
};

// <extrude>:
exports.extrude = function extrude(flag) {
  return '<extrude>' + (flag? flag : 1) + '</extrude>\n';
};

// <heading>:
exports.heading = function heading(degrees) {
  return '<heading>' + degrees + '</heading>';
};

// <href>:
exports.href = function href(ref) {
  return '<href>' + ref + '</href>\n';
};

// <Icon>:
exports.icon = function icon(bodyContent) {
  return '<Icon>\n'
    + bodyContent
    + '</Icon>\n';
};

// <Icon><href>:
exports.iconHref = function iconHref(ref) {
  return exports.icon(
      exports.href(ref)
    );
};

// wrap body content String in standard XML and KML envelope:
exports.kml = function kml(bodyContent) {
  return '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">\n'
    + bodyContent
    + '</kml>\n';
};

// <latitude>:
exports.latitude = function latitude(lat) {
  return '<latitude>' + lat + '</latitude>';
};

// <LineString>:
exports.lineString = function lineString(bodyContent) {
  return '<LineString>\n'
    + bodyContent
    + '</LineString>\n';
};

// <LineStyle>:
exports.lineStyle = function lineStyle(bodyContent) {
  return '<LineStyle>\n'
    + bodyContent
    + ' </LineStyle>\n';
};

// <LineStyle><color><width>:
exports.lineStyleColorWidth = function lineStyleColorWidth(c, w) {
  return exports.lineStyle(
        exports.color(c)
      + exports.width(w)
    );
};

// <Link>:
exports.link = function link(bodyContent) {
  return '<Link>\n'
    + bodyContent
    + '</Link>\n';
};

// <Link><href>:
exports.linkHref = function linkHref(href) {
  return exports.link(
        '<href>' + href + '</href>\n'
      );
};

// <Location>:
exports.location = function location(bodyContent) {
  return '<Location>\n'
    + bodyContent
    + '</Location>\n';
};

// <Location><longitude><latitude><altitude>:
exports.location3 = function location3(lng, lat, alt) {
  return exports.location(
      exports.longitude(lng) + exports.latitude(lat) + exports.altitude(alt)
    );
};

// <longitude>:
exports.longitude = function longitude(lng) {
  return '<longitude>' + lng + '</longitude>';
};

// <Model>:
exports.model = function model(id, bodyContent) {
  return '<Model id="' + id + '">\n'
    + bodyContent
    + '</Model>\n';
};

// <name>:
exports.name = function name(n) {
  return '<name>' + n + '</name>\n';
};

// <NetworkLinkControl>:
exports.networkLinkControl = function networkLinkControl(bodyContent) {
  return '<NetworkLinkControl>\n'
    + bodyContent
    + '</NetworkLinkControl>\n';
};

// <Orientation>:
exports.orientation = function orientation(bodyContent) {
  return '<Orientation>\n'
    + bodyContent
    + '</Orientation>\n';
};

// <Orientation><heading><tilt><roll>:
exports.orientation3 = function orientation3(h, t, r) {
  return exports.orientation(
      exports.heading(h) +exports.tilt(t) + exports.roll(r)
    );
};

// <Placemark>:
exports.placemark = function placemark(bodyContent) {
  return '<Placemark>\n'
    + bodyContent
    + '</Placemark>\n';
};

// <Point>:
exports.point = function point(bodyContent) {
  return '<Point>\n'
    + bodyContent
    + '</Point>\n';
};

// <PolyStyle>:
exports.polyStyle = function polyStyle(color) {
  return '<PolyStyle>\n'
    + '  <color>' + color + '</color>\n'
    + ' </PolyStyle>\n';
};

// <roll>:
exports.roll = function roll(degrees) {
  return '<roll>' + degrees + '</roll>';
};

// <scale> 2D entity with single scale factor. Used in IconStyle
exports.scale = function scale(factor) {
  console.log('scale(' + factor + ')');
  return '<scale>' + factor + '</scale>\n';
};

// Scale 3D entity with x, y, and z scale factors.
// y and z param values are optional, if omitted they will default to the same as the x param.
exports.scale3 = function scale3(x, y, z) {
  console.log('scale3(' + x + ', ' + y + ', ' + z + ')');
  return '<Scale><x>' + x + '</x><y>' + (y? y : x) + '</y><z>' + (z? z : x) + '</z></Scale>\n';
};

// <Style>:
exports.style = function style(id, bodyContent) {
  return '<Style id="' + id + '">\n'
    + bodyContent
    + '</Style>\n';
};

// <styleUrl>
exports.styleUrl = function styleUrl(url) {
  return '<styleUrl>' + url + '</styleUrl>\n';
};

// <tessellate>:
exports.tessellate = function tessellate(flag) {
  return '<tessellate>' + (flag? flag : 1) + '</tessellate>\n';
};

// <tilt>:
exports.tilt = function tilt(degrees) {
  return '<tilt>' + degrees + '</tilt>';
};

// <width>:
exports.width = function width(w) {
  return '<width>' + w + '</width>\n';
};

// NOTE: longitude comes before latitude, following KML convention.
var Coords3 = function Coords3(id, lng, lat, alt) {
  this.id = id;
  this.lng = lng? parseFloat(lng) : 0.0;
  this.lat = lat? parseFloat(lat) : 0.0;
  this.alt = alt? parseFloat(alt) : 0.0;
};

Coords3.prototype.toKml = function() {
  return this.lng + ',' + this.lat + ',' + this.alt;
};

Coords3.prototype.toLocationKml = function() {
  return exports.location3(this.lng, this.lat, this.alt);
};

Coords3.prototype.add = function(other) {
  return new Coords3(this.id, this.lng + other.lng, this.lat + other.lat, this.alt + other.alt);
};

Coords3.prototype.subtract = function(other) {
  return new Coords3(this.id, this.lng - other.lng, this.lat - other.lat, this.alt - other.alt);
};

Coords3.prototype.divide = function(divisor) {
  return new Coords3(this.id, this.lng/divisor, this.lat/divisor, this.alt/divisor);
};

Coords3.prototype.dot = function(other) {
  return this.lng*other.lng + this.lat*other.lat + this.alt*other.alt;
};

Coords3.prototype.length = function() {
  return Math.sqrt(this.dot(this));
};

Coords3.prototype.unit = function() {
  return this.divide(this.length());
};

Coords3.prototype.headingRadians = function() {
  return Math.atan2(this.lng, this.lat);
};

Coords3.prototype.headingDegrees = function() {
  return 180*this.headingRadians()/Math.PI;
};

Coords3.prototype.quadrant = function() {
    if (this.lat < 0.0 && this.lng < 0.0) {
      // 3rd quadrant
      return 3;
    }
    if (this.lat < 0.0) { // && this.lng > 0.0
      // 2nd quadrant, handled ok?
      return 2;
    }
    if (this.lng < 0.0) { // && this.lat > 0.0
      // 4th quadrant
      return 4;
    }
    // 1st quadrant (both lat > 0.0 && lng > 0.0)
      return 1;
};

Coords3.prototype.clone = function() {
  return new Coords3(this.id, this.lng, this.lat, this.alt);
};

exports.Coords3 = Coords3;


var Orientation = function Orientation(id, heading, tilt, roll) {
  this.id = id;
  this.heading = heading? parseFloat(heading) : 0.0; // North
  this.tilt = tilt? parseFloat(tilt) : 0.0; // horizontal
  this.roll = roll? parseFloat(roll) : 0.0; // horizontal
};

Orientation.prototype.toKml = function() {
  return exports.orientation3(this.heading, this.tilt, this.roll);
};

Orientation.prototype.clone = function() {
  return new Orientation(this.id, this.heading, this.tilt, this.roll);
};

exports.Orientation = Orientation;

