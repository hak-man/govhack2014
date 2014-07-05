// A $( document ).ready() block.
$( document ).ready(function() {
    var map = kartograph.map('#map');
    map.loadMap('svg/world.svg', function(){
	    map.addLayer('mylayer', {
            styles: {
                stroke: '#aaa',
                fill: '#f6f4f2'
            }
        });

        var layer = map.getLayer('mylayer');
        var previous = null;

        // Countries starting with A get filled with green else grey
//        layer.style('fill', function(data) {
//            return (data.name.charAt(0) === "A") ? '#5ED391' : '#f6f4f2';
//        });

    	layer.on('click', function(data, path, event) {
                console.log(data);
                if (path != previous) {
                    if (previous) {
                        previous.attr('fill', '#f6f4f2');
                    }
                    previous = path;
                    path.animate({ fill: '#5ED391' }, 500);
                    updateTable(data);
                }
        });
    });
});

function updateTable(data) {
    $("#map-table").html("<table class='table table-hover'><tr><td class='col-md-2'><b>Name</b></td><td class='col-md-10'>"+data.name+"</td></tr></table>");
}