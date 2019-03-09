function map(sweden_counties, cities_geom, cities_inhabitants){
	var mymap = L.map('mapid').setView([62, 15], 5);

	//var geojson;

	//var geoJsonData = new L.GeoJSON.AJAX("../sweden_counties.geojson");  
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	    maxZoom: 18,
	    minZoom: 5,
	    id: 'mapbox.light',
	    noWrap: true,
	    accessToken: 'pk.eyJ1IjoibWN0aWFzIiwiYSI6ImNqc2V2ZDB4ajE2dTc0M282azR0eTVocW8ifQ.IQP4GS8uS3dB3J5i1PGKZA'
	}).addTo(mymap);

	
	L.svg({clickable:true}).addTo(mymap);	

	//Adding a info box that displays info when you hover over
	/*var info = L.control();

	info.onAdd = function(map){
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
	};

	info.update = function(props){
		this._div.innerHTML = '<h4>Data</h4>' + (props ? '<b>' + props.name: 'Hovra över ett län');
	};

	info.addTo(mymap);*/
	
	
	
	
	var svg = d3.select("#mapid").select("svg").attr("pointer-events", "auto");
	var g = svg.append("g");
	
	d3.json("cities_geom.geojson", function(collection) {
		// Add a LatLng object to each item in the dataset 
		collection.features.forEach(function(d) {
			d.latLng = new L.LatLng(d.geometry.coordinates[0],
									d.geometry.coordinates[1]);
		});
	
		var feature = g.selectAll("circle")
			.data(collection.features)
			.enter().append("circle")
			.attr("class", "mapcircle")
			.style("stroke", "black")
			.style("opacity", .6)
			.style("fill", "red")
			.attr("r", 6);
			
			mouseOver(feature);
			mouseOut(feature);
			
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

	function mouseOver(feature){
		 feature.on("mouseover", function(){
		 	d3.select(this) 
        	.transition()
        	.duration(500)
        	.attr("r", 20);
        });
	}
	function mouseOut(feature){

        feature.on("mouseout", function () {
            d3.select(this)
                .transition()
                .duration(500)
                .attr("r", 6);
            });
          
    }

	
	
	/*//Styling of the layover
	function style(){
		return{
			fillColor: '',
			weight: 0.5,
			opacity: 1,
			color: 'black',
			fillOpacity: 0
		};
		
	}
	

	//Styling of the layover when you highlight it
	function highlightFeature(e){
		var layer = e.target;

		layer.setStyle({
			weight: 3,
			dashArray: '',
			fillOpacity: 0.1
		});

		if(!L.Browser.ie && !L.Browser.opera && !L.Browser.edge){
			layer.bringToFront();
		}
		console.log(layer.feature.properties);
		info.update(layer.feature.properties);
	}

	//Reset of the layover when you dehighlight it
	function resetHighlight(e){
		geojson.resetStyle(e.target);
		info.update();
	}

	function zoomToFeature(e) {
    	mymap.fitBounds(e.target.getBounds());
	}

	//all the features
	function onEachFeature(feature, layer) {
   		layer.on({
        	mouseover: highlightFeature,
        	mouseout: resetHighlight,
        	click: zoomToFeature
    	});
	}	


	//Map the layover
	geojson = L.geoJson(data, 
			{style: style,
			onEachFeature: onEachFeature}).addTo(mymap);*/

	
}




