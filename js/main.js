var map;
d3.json("./sweden_counties.geojson", (data)=>{
	map = new map(data);
});
