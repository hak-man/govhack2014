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

var VEHICLE_DAE_LINK = "<Link><href>file://ewrd-smb/data/slew_uav/Aircraft%20Pictures/models/AerosondeUAV1.dae</href></Link>\n";

var VEHICLE_DAE_SCALE = 0.1;

var VEHICLE_SCALE_KML = kml.scale3(VEHICLE_DAE_SCALE, VEHICLE_DAE_SCALE, VEHICLE_DAE_SCALE);

// END CONFIGURATION SECTION


console.log('KML Update Server initialising...');

process.on('uncaughtException', function onUncaughtException(err) {
	console.log('Caught exception: ' + err);
});

var http = require('http'); // for HTTP server to serve KML position updates to Goolge Earth clients.

// previous positions required to determine heading
var prevPositions = {};
var currPositions = {};
var currHeadings = {};
var prevHeadings = {};

var s = http.createServer(function httpServe(req, res) {
  
  var expiryDate = new Date();
  expiryDate.setTime(expiryDate.getTime() + 6 * 1000); // expire in 6 seconds from now
  var expiryString = kml.ISODateString(expiryDate);
  
  // var time = expiryDate.getTime();
  
  var kmlStr = ''
    + kml.name('Transport Vehicle Position Update')
    + kml.atomAuthorLink('Greg Bowering', 'mailto:gerg.bowering@gmail.com')
    + kml.style('yellowLineGreenPoly', ''
      + kml.lineStyleColorWidth('7f00ffff', 4)
      + kml.polyStyle('7f00ff00')
      );
      
  for (service_id in prevPositions) {
    // Plot positions including heading and movement vectors for each service_id
    var prevPosition = prevPositions[service_id];
    var currPosition = currPositions[service_id];
    var headingDegrees;
    
    if (service_id in currHeadings && currHeadings[service_id] != 0.0) {
      headingDegrees = currHeadings[service_id];
    } else {
      // The following calculates heading based on change in position:
      if (prevPosition === undefined) {
      	headingDegrees = 0;
      	prevPosition = [];
      	prevPositions[service_id] = prevPosition;
      } else if (prevPosition.length == 0) {
      	headingDegrees = 0;
      } else {
        var positionChange = currPosition.subtract(prevPosition[0]);
        headingDegrees = positionChange.headingDegrees();
      }
    }
    
    
    var deltaAlt;
    if (prevPosition === undefined || prevPosition.length == 0) {
      deltaAlt = 0;
    } else {
      deltaAlt = currPosition.alt - prevPosition[0].alt;
    }
    
      // console.log('positionChange=' + positionChange.toKml() + ' quadrant=' + positionChange.quadrant() + ' heading=' + headingDegrees);
           
      var prevPositionKml = '';
      for (i in prevPosition) {
        if (prevPosition[i] != undefined) {
          prevPositionKml += prevPosition[i].toKml() + '\n';
        }
      }
      
      var tiltDegrees = 0.0;
      // fudge tilt based on change in altitude (vehicle going up or down hill)
      tiltDegrees = -2.0*deltaAlt;
      if (tiltDegrees < -90.0) tiltDegrees = -90.0;
      if (tiltDegrees > 90.0) tiltDegrees = 90.0;
      // console.log('delta alt=' + deltaAlt + ' tiltDegrees=' + tiltDegrees);
      
      // assume transit vehicles never "roll"
      var rollDegrees = 0.0;

      prevHeadings[service_id] = headingDegrees;
      
      var orientation = new kml.Orientation(service_id, headingDegrees, tiltDegrees, rollDegrees);
      
	kmlStr += ''
	  + kml.placemark(''
	    + kml.name('UAV-' + service_id)
	    + kml.model('model_' + service_id, ''
	      + kml.altitudeMode()
	      + currPosition.toLocationKml() + '\n' // Location
	      + orientation.toKml() + '\n' // Orientation
	      + VEHICLE_SCALE_KML
	      + VEHICLE_DAE_LINK // Model Link (and optional ResourceMap for textures)
	      )
	    )
	  + kml.placemark(''
	    + kml.name('track-' + service_id)
	    + kml.description('Transparent green wall with yellow outlines')
	    + kml.styleUrl('#yellowLineGreenPoly')
	    + kml.lineString(''
	      + kml.extrude()
	      + kml.tessellate()
	      + kml.altitudeMode()
	      + kml.coordinates(''
		+ currPosition.toKml() + '\n' // New Location
		+ prevPositionKml + '\n' // Old Locations
	        )
	      )
	    );
     
  }
   
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

// TODO
// Every second we query SIRI web service for current position of vehicle (Requires SIRI Vehicle Monitoring service)
// Update postions array with current reported position of vehicle

