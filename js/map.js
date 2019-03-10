function map(sweden_counties, cities_geom, cities_inhabitants){
	this.year = 1570;
	this.svglayer = null;

	this.update = function(year) {
		this.year = year;
		let inhab = cities_inhabitants[year];
		let inhab_next = cities_inhabitants[year+10];

		if (mymap.hasLayer(this.svglayer)){
			mymap.removeLayer(this.svglayer);
		}
		this.svglayer = null;
		
		this.svglayer = L.svg({clickable:true}).addTo(mymap);	
		
		var svg = d3.select("#mapid").select("svg").attr("pointer-events", "auto");
		var g = svg.append("g");
		
		let mean_x = 0;
		let mean_y = 0;
		let count_cities = 0;
		let count_inhab = 0;
		
		// Add a LatLng object to each item in the dataset 
		cities_geom.features.forEach(function(d) {
			d.latLng = new L.LatLng(Math.round(d.geometry.coordinates[1]*100)/100,
									Math.round(d.geometry.coordinates[0]*100)/100);
			
			if (!isNaN(d.geometry.coordinates[0]*parseInt(inhab[d.properties.city])) && !isNaN(d.geometry.coordinates[1]*parseInt(inhab[d.properties.city]))){
				count_cities++;
				count_inhab+=parseInt(inhab[d.properties.city]);
				mean_x += d.geometry.coordinates[0]*parseInt(inhab[d.properties.city]);
				mean_y += d.geometry.coordinates[1]*parseInt(inhab[d.properties.city]);
			}
		});
		
		mean_x = mean_x/(count_inhab);
		mean_y = mean_y/(count_inhab);
		
		console.log(count_cities, mean_x, mean_y);

		var feature = g.selectAll("circle")
			.data(cities_geom.features)
			.enter().append("circle")
			.attr("class", "mapcircle")
			.style("stroke", "black")
			.style("opacity", function(d){
				let opacity = 0.2;
				if (inhab[d.properties.city] == 0 || inhab_next[d.properties.city] == 0) {
					return 0.5;
				}
				let increase = Math.max(0.1, (inhab_next[d.properties.city] - inhab[d.properties.city])/inhab[d.properties.city]);
				if (isNaN(increase)) {
					return 0.5;
				}
				//console.log(opacity+increase);
				return opacity+2*increase;
			})
			.style("fill", function(d){
				return "red";
			})
			.attr("r", function(d){

				let size = Math.floor(Math.pow(inhab[d.properties.city], 0.25));
				//console.log(this.filter);
				if (isNaN(size)) {
					return 0;
				}
				if (inhab[d.properties.city] < 0) {
					return 0;
				}

				return size;
			});
			
			mouseOver(feature, inhab);
			mouseOut(feature);
		feature.attr("transform",
		    	function(d) {
		   			var layerPoint = mymap.latLngToLayerPoint(d.latLng);
		     		return "translate("+ layerPoint.x +","+ layerPoint.y +")";
		        }
		    )
	}
	
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

	this.update(this.year);
	//this.setFilter(this.filter);
	mymap.on("zoomend", this.update(this.year));

	function mouseOver(feature, population){
		 feature.on("mouseover", function(d){
		 	d3.select(this) 
        	.transition()
        	.duration(500)
        	.style("fill", "green");
        	tooltip(d, population);
        });

		
	}
	function mouseOut(feature){

        feature.on("mouseout", function () {
            d3.select(this)
                .transition()
                .duration(500)
                .style("fill", "red");
            });
          
    }

    function tooltip(d, population){
    	var tooltip = d3.select("#tooltip")
        tooltip
            .select("#name")
            .text("Name: " + d.properties.city);
        tooltip
            .select("#population")
            .text("Population: " + population[d.properties.city]);
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