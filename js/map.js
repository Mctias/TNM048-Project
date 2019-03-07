function map(data){
	var mymap = L.map('mapid').setView([62, 15], 5);

	var geojson;

	//var geoJsonData = new L.GeoJSON.AJAX("../sweden_counties.geojson");   
	
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	    maxZoom: 18,
	    id: 'mapbox.streets',
	    accessToken: 'pk.eyJ1IjoibWN0aWFzIiwiYSI6ImNqc2V2ZDB4ajE2dTc0M282azR0eTVocW8ifQ.IQP4GS8uS3dB3J5i1PGKZA'
	}).addTo(mymap);
	
	var svgLayer = L.svg();
	svgLayer.addTo(mymap);
	
	
	
	
	var svg = d3.select("#mapid").select("svg");
	var g = svg.append("g");
	
	d3.json("circles.json", function(collection) {
		/* Add a LatLng object to each item in the dataset */
		collection.objects.forEach(function(d) {
			d.latLng = new L.LatLng(d.circle.coordinates[0],
									d.circle.coordinates[1]);
		});
	
		var feature = g.selectAll("circle")
			.data(collection.objects)
			.enter().append("circle")
			.style("stroke", "black")
			.style("opacity", .6)
			.style("fill", "red")
			.attr("r", 10);
		
		function update() {
		    feature.attr("transform",
		    	function(d) {
		   			var layerPoint = mymap.latLngToLayerPoint(d.latLng);
		     		return "translate("+ layerPoint.x +","+ layerPoint.y +")";
		        }
		    )
		}
				
		update();
		mymap.on("moveend", update);
		
	});
	
	function style(){
		return{
			fillColor: '',
			weight: 1,
			opacity: 1,
			color: 'black',
			fillOpacity: 0
		};
		
	}

	function highlightFeature(e){
		var layer = e.target;

		layer.setStyle({
			weight: 5,
			color: '#666',
			dashArray: '',
			fillOpacity: 0.7
		});

		if(!L.Browser.ie && !L.Browser.opera && !L.Browser.edge){
			layer.bringToFront();
		}
	}

	function resetHighlight(e){
		geojson.resetStyle(e.target);
	}

	function zoomToFeature(e) {
    	mymap.fitBounds(e.target.getBounds());
	}

	function onEachFeature(feature, layer) {
   		layer.on({
        	mouseover: highlightFeature,
        	mouseout: resetHighlight,
        	click: zoomToFeature
    	});
	}	

	geojson = L.geoJson(data, 
			{style: style,
			onEachFeature: onEachFeature}).addTo(mymap);
}




