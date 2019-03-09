var map;
d3.json("./sweden_counties.geojson", (sweden_counties)=>{
	d3.json("./cities_geom.geojson", (sweden_counties, cities_geom)=>{
		d3.json("./cities_inhabitants.json", (sweden_counties, cities_geom, cities_inhabitants)=>{
			map = new map(sweden_counties, cities_geom, cities_inhabitants);
		});
	});
});
