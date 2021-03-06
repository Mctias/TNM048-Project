var map;

d3.json("./cities_geom_4326.geojson", (cities_geom)=>{
	d3.json("./cities_inhabitants.json", (cities_inhabitants)=>{
		
		let min_year = 1580;
		let max_year = 2000;
		let step = 20;
		let steps = Math.floor((max_year-min_year)/step);

		var sliderTime = d3
			.sliderBottom()
			.min(min_year)
			.max(max_year)
			.ticks(steps)
			.tickFormat(d3.format(''))
			.step(step)
			.width(750)
			.on('onchange', val => {
				d3.select('p#value-time').text(val);
				map.update(val);
			});

		var gTime = d3
			.select('div#slider-time')
			.append('svg')
			.attr('width', 800)
			.attr('height', 100)
			.append('g')
			.attr('transform', 'translate(25,25)');

		gTime.call(sliderTime);
		d3.select('p#value-time').text(min_year);
		
		map = new map(min_year, cities_geom, cities_inhabitants);
	});
});
