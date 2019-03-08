//function(data){
var width = 960,
    height = 500,
    centered,
    active;
 var s = height / 0.525;

 var translateX = width/(2-500),  
     translateY = height/2+1358;

	var projection = d3.geoMercator()
					.scale(s)
					//.center([62, 15])
					.translate([translateX, translateY]);

	var zoom = d3.zoom()
				.scaleExtent([1, 10])
				.on("zoom", zoomed);

	var path = d3.geoPath().projection(projection);

	var svg = d3.select("body")
				.append("svg")
				.attr("width", width)
				.attr("height", height);

	svg.append("rect")
	   .attr("width", width)
	   .attr("height", height)
	   .on("click", reset);
				
	var g = svg.append("g");

	//svg.call(zoom);
	

	d3.json("./sweden_counties.geojson", draw);

	function draw(geojson){
		svg.selectAll("path")
		   .data(geojson.features)
		   .enter()
		   .append("path")
		   .attr("d", path)
		   .attr("class", "feature")
		   .on("click", click);

		   g.append("path")
		   	.datum(geojson)
		   	.attr("class", "mesh")
		   	.attr("d", path);
	}

	function zoomed(){
		g.attr("transform", d3.event.transform);
	}

	function click(d){
		if(active === d) return reset();

		g.selectAll(".active").classed("active", false);
		d3.select(this).classed("active", active = d);
	}

	function reset(){
		console.log('reset')
		g.selectAll(".active").classed("active", active = false);
		//g.transition().duration(750).attr("transform", "");
	}


//}