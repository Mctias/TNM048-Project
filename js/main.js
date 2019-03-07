var map;
d3.json("./sweden_counties.geojson", function (data) {
    //Working with the map
    map = new map(data);
});