function Map(){
	this.map = L.map('mapid').setView([62, 15], 5);
	this.cities_geom = null;
	this.cities_inhabitants = null;
	this.swedish_counties = null;

	//Styling of the layover
	this.style = function(){
		return {
			fillColor: '',
			weight: 1,
			opacity: 1,
			color: 'black',
			fillOpacity: 0
		};
	}

	this.onEachFeature = function(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: zoomToFeature
		});
	}

	this.init = function() {
		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
			attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
			maxZoom: 18,
			id: 'mapbox.streets',
			accessToken: 'pk.eyJ1IjoibWN0aWFzIiwiYSI6ImNqc2V2ZDB4ajE2dTc0M282azR0eTVocW8ifQ.IQP4GS8uS3dB3J5i1PGKZA'
		}).addTo(this.map);

		var svgLayer = L.svg();
		svgLayer.addTo(this.map);

		//Adding a info box that displays info when you hover over
		var info = L.control();
		info.onAdd = function(map){
			this._div = L.DomUtil.create('div', 'info');
			this.update();
			return this._div;
		};
		info.update = function(props){
			this._div.innerHTML = '<h4>Någon kul data</h4>' + (props ? '<b>' + props.name + '<b> <br />' + props.density + 'st' : 'Hovra över ett län');
		};
		info.addTo(this.map);

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
						var layerPoint = Map.latLngToLayerPoint(d.latLng);
						return "translate("+ layerPoint.x +","+ layerPoint.y +")";
					}
				)
			}	
			update();
			this.map.on("moveend", update);
		});
		
		properties:({

		})

		//Styling of the layover when you highlight it
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

			info.update({name: 'lol', density: 100});
		}

		//Reset of the layover when you dehighlight it
		function resetHighlight(e){
			geojson.resetStyle(e.target);
			info.update();
		}

		function zoomToFeature(e) {
			mymap.fitBounds(e.target.getBounds());
		}
	}
	
	this.loadData = function() {
		d3.json("./cities_geom.geojson", function (data) {
			this.cities_geom = L.geoJson(data, {
					style: this.style,
					onEachFeature: this.onEachFeature
				}).addTo(this.map);
		});

		d3.json("./sweden_counties.geojson", function (data) {
			this.sweden_counties = L.geoJson(data, {
				style: this.style,
				onEachFeature: this.onEachFeature
			}).addTo(this.map);
		});

		d3.json("./cities_inhabitants.json", function (data) {
			
		});
	}

	this.update = function(year) {
		
	}
}




