function map(start_year, cities_geom, cities_inhabitants){
	
	// ---------- Declare functions ----------
	
	// Function to update map
	this.update = function(year) {
		
		this.year = start_year;
		if (year) {
			this.year = year;
		}
		var inhab = cities_inhabitants[this.year];
		var inhab_next = cities_inhabitants[this.year+10];
		
		// Set fill color of cities
		function setFillColor(d){
			let color = "#555555";
			let inhab_city = parseInt(inhab[d.properties.city]);
			let inhab_city_next = parseInt(inhab_next[d.properties.city]);
			
			if (inhab_city == 0 || inhab_city_next == 0) {
				return color;
			}
			let increase = (inhab_city_next - inhab_city)/inhab_city;
			if (isNaN(increase)) {
				return color;
			}
			if (increase > 0){
				color = "#" + String(Math.max(0,55-Math.round(increase*50))) + String(Math.min(99,55+Math.round(increase*50))) + "55";
			} else {
				increase *= -1;
				color = "#" + String(Math.max(0,55+Math.round(increase*150))) + String(Math.min(99,55-Math.round(increase*150))) + "55";
			}
			return color;
		}
		
		// Set opacity of cities
		function setOpacity(d) {
			let opacity = 0.2;
			let inhab_city = parseInt(inhab[d.properties.city]);
			let inhab_city_next = parseInt(inhab_next[d.properties.city]);
			
			if (inhab_city <= 0 || inhab_city_next <= 0) {
				return 0.5;
			}
			let increase = Math.max(0.1, (inhab_city_next - inhab_city)/inhab_city);
			if (isNaN(increase)) {
				return 0.5;
			}
			return opacity+2*increase;
		}
		
		// Set size of cities
		function setSize(d) {
			let inhab_city = parseInt(inhab[d.properties.city]);
			let size = Math.floor(Math.pow(inhab_city, 0.25));
			
			if (isNaN(size) || inhab_city <= 0) {
				return 0;
			}
			return size;
		}
		
		// Transform cities
		function transformPoint(d) {
			var layerPoint = mymap.latLngToLayerPoint(d.latLng);
			return "translate("+ layerPoint.x +","+ layerPoint.y +")";
		}
		
		// Update tooltip
		function tooltip(d){
			var tooltip = d3.select("#tooltip")
			tooltip
				.select("#name")
				.text("Name: " + d.properties.city);
			tooltip
				.select("#population")
				.text("Population: " + String(inhab[d.properties.city]));
		}
	
		// Clear all map layers except background layer
		mymap.eachLayer(function (layer) {
			if(!layer.options.attribution){
				mymap.removeLayer(layer);
			}
		});
		
		// Add svg layer to map
		L.svg({clickable:true}).addTo(mymap);
		var svg = d3.select("#mapid").select("svg").attr("pointer-events", "auto");
		var g = svg.append("g");
		
		// Init variables for center point calculation
		let mean_x = 0;
		let mean_y = 0;
		let count_cities = 0;
		let count_inhab = 0;
		
		cities_geom.features.forEach(function(d) {
			// Add latLng object with coordinates
			d.latLng = new L.LatLng(d.geometry.coordinates[1],
									d.geometry.coordinates[0]);
			
			// Add data for center point calculation
			let inhab_city = parseInt(inhab[d.properties.city]);
			if (!isNaN(d.geometry.coordinates[0]*inhab_city) && !isNaN(d.geometry.coordinates[1]*inhab_city)){
				count_cities++;
				count_inhab += inhab_city;
				mean_x += d.geometry.coordinates[0]*inhab_city;
				mean_y += d.geometry.coordinates[1]*inhab_city;
			}
		});
		
		// Calculate center point
		mean_x = mean_x/(count_inhab);
		mean_y = mean_y/(count_inhab);
		
		// Draw city points
		var feature = g.selectAll("circle")
			.data(cities_geom.features)
			.enter().append("circle")
			.attr("class", "mapcircle")
			.style("stroke", "black")
			.style("opacity", function(d){return setOpacity(d)})
			.style("fill", function(d){return setFillColor(d)})
			.attr("r", function(d){return setSize(d)})
			.attr("transform", function(d){return transformPoint(d)});
			
		feature.on("mouseover", function(d){
			d3.select(this) 
			.transition()
			.duration(200)
			.style("fill", "blue");
			tooltip(d);
		});
		
		feature.on("mouseout", function () {
			d3.select(this)
				.transition()
				.duration(200)
				.style("opacity", function(d){return setOpacity(d)})
				.style("fill", function(d){return setFillColor(d)})
		});
		
		// Draw center point
		let center_point = L.circle([mean_y, mean_x], {
			color: 'black',
			fillColor: 'blue',
			fillOpacity: 0.5,
		});
		
		center_point.setRadius(10*(36-2*mymap.getZoom())+(Math.pow(count_inhab,0.85)*0.01*(36-2*mymap.getZoom())));
		center_point.addTo(mymap);
	}
	
	
	// ---------- Start module ----------
	
	// Init map
	var mymap = L.map('mapid').setView([62, 15], 5);

	// Add background layer
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	    maxZoom: 18,
	    minZoom: 5,
	    id: 'mapbox.light',
	    noWrap: true,
	    accessToken: 'pk.eyJ1IjoibWN0aWFzIiwiYSI6ImNqc2V2ZDB4ajE2dTc0M282azR0eTVocW8ifQ.IQP4GS8uS3dB3J5i1PGKZA'
	}).addTo(mymap);	
	
	// Event handlers
	mymap.on("moveend", function(){
		setTimeout(function(){
			map.update();
		}, 1);
	});
	mymap.on("zoomend", function(){
		setTimeout(function(){
			map.update();
		}, 1);
	});
	
	// Initial map update
	this.update();
}