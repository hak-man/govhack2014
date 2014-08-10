// KML Update Server
// Requires Node.js
// 
// This server receives KML network-link update requests
// from clients and responds with KML representing
// a dynamic geo-spatial picture.
//
// @author Greg Bowering 2014


var kml = require('./kml');

// CONFIGURATION SECTION

var KML_PORT = 1338;

// var VEHICLE_ICON_URL = 'web/path/to/PNG/icon/to/display/in/sidebar/tree';

var VEHICLE_DAE_LINK = "<Link><href>http://users.on.net/~gb1/dae/Adelaide%20Alstom%20Citadis%20302.dae</href></Link>\n";

var VEHICLE_DAE_SCALE = 1.0;

var VEHICLE_SCALE_KML = kml.scale3(VEHICLE_DAE_SCALE, VEHICLE_DAE_SCALE, VEHICLE_DAE_SCALE);

// model is not always oriented North-South (0 degrees) so need to apply an offset when rendering:
var VEHICLE_ORIENTATION_OFFSET = 90.0;

// END CONFIGURATION SECTION


console.log('KML Update Server initialising...');

process.on('uncaughtException', function onUncaughtException(err) {
	console.log('Caught exception: ' + err);
});

var http = require('http'); // for HTTP server to serve KML position updates to Goolge Earth clients.

// previous positions required to determine heading
var prevPositions = {};
var currPositions = {"TramId": new kml.Coords3("TramId", 138.587222, -34.922150)};
var currHeadings = {};
var prevHeadings = {};

// Timer Callback to update all vehicle positions each second:
var updateEverySecond = function() {
  // TODO use SIRI realtime service to determine accurate vehicle position.
  // FIXME for now just using dummy position updates!

  // Dummy movement vectors to move a vehcile.
  var dummyMoveNorth = new kml.Coords3("moveNorth",  0.0,  0.00001);
  var dummyMoveSouth = new kml.Coords3("moveSouth",  0.0, -0.00001);
  var dummyMoveEast = new kml.Coords3("moveEast",  0.00001, 0);
  var dummyMoveWest = new kml.Coords3("moveWest", -0.00001, 0);

  for (service_id in currPositions) {
//    console.log("updating service_id " + service_id);

    var currPosition = currPositions[service_id];
    prevPositions[service_id] = currPosition;
    currPosition = currPosition.add(dummyMoveEast);
    currPositions[service_id] = currPosition;
  }
}
setInterval(updateEverySecond, 1000);



// This Web Server handles client network link update requests.
// FIXME should have no vehicle postion/orientation processing here.
// All vehicle processing should be moved to the updateEverySecond callback.
// This server should only read current vehicle positions and respond with KML to clients.
var s = http.createServer(function httpServe(req, res) {
  
  var expiryDate = new Date();
  expiryDate.setTime(expiryDate.getTime() + 30 * 1000); // expire in 30 seconds from now
  var expiryString = kml.ISODateString(expiryDate);
  
  // var time = expiryDate.getTime();
  
  var kmlStr = ''
    + kml.name('Transport Vehicle Position Update')
    + kml.atomAuthorLink('Greg Bowering', 'mailto:gerg.bowering@gmail.com');
      
  for (service_id in prevPositions) {
    // Plot positions including heading and movement vectors for each service_id
    console.log("plotting service_id " + service_id);
    
    var prevPosition = prevPositions[service_id];
    var currPosition = currPositions[service_id];
    var headingDegrees;
    
    if (service_id in currHeadings && currHeadings[service_id] != 0.0) {
      headingDegrees = currHeadings[service_id];
      prevHeadings[service_id] = headingDegrees;
    } else {
      // The following calculates heading based on change in position:
      if (prevPosition === undefined) {
      	headingDegrees = 0;
      } else {
        var positionChange = currPosition.subtract(prevPosition);
        headingDegrees = positionChange.headingDegrees();
        console.log('positionChange=' + positionChange.toKml() + ' quadrant=' + positionChange.quadrant() + ' heading=' + headingDegrees);
      }
    }
        
    var deltaAlt;
    if (prevPosition === undefined) {
      deltaAlt = 0;
    } else {
      deltaAlt = currPosition.alt - prevPosition.alt;
    }
    
           
      var tiltDegrees = 0.0;
      // fudge tilt based on change in altitude (vehicle going up or down hill)
      tiltDegrees = -2.0*deltaAlt;
      if (tiltDegrees < -90.0) tiltDegrees = -90.0;
      if (tiltDegrees > 90.0) tiltDegrees = 90.0;
      // console.log('delta alt=' + deltaAlt + ' tiltDegrees=' + tiltDegrees);
      
      // assume transit vehicles never "roll"
      var rollDegrees = 0.0;

//      currHeadings[service_id] = headingDegrees; // no! do not persist derived heading here
    
      var orientation = new kml.Orientation(service_id, headingDegrees + VEHICLE_ORIENTATION_OFFSET, tiltDegrees, rollDegrees);
      
	kmlStr += ''
	  + kml.placemark(''
	    + kml.name('Vehicle-' + service_id)
	    + kml.model('model_' + service_id, ''
	      + kml.altitudeMode('clampToGround') // Default altitudeMode is 'absolute', better to clamp surface-vehicles.
	      + currPosition.toLocationKml() + '\n' // Location
	      + orientation.toKml() + '\n' // Orientation
	      + VEHICLE_SCALE_KML
	      + VEHICLE_DAE_LINK // Model Link (and optional ResourceMap for textures)
	      )
	    );
	    
  } // for (service_id in prevPositions)
   
   kmlStr = kml.kml(
     kml.networkLinkControl(kml.expires(expiryString))
     + kml.document(kmlStr)
   );

  res.writeHead(200, kml.HTTP_HEADERS);
  res.end(kmlStr);
  
});

s.listen(KML_PORT);

console.log('KML Update Server running at port ' + KML_PORT);

function degreesMinutesToDecimalDegrees(degreesMinutes, pole) {
	var wholeDegrees = degreesMinutes.substr(0, degreesMinutes.length - 7);
	var decimalMinutes = degreesMinutes.substr(degreesMinutes.length - 7);
	var decimalDegrees = parseFloat(wholeDegrees) + parseFloat(decimalMinutes)/60.0;
	if (pole == 'S' || pole == 'W') {
		return -decimalDegrees;
	}
	return decimalDegrees;
}

// FIXME this file needs reformatting.  Need to edit in a javascript IDE rather than text editor!

