var svgw = 0;
var svgh = 0;
var limits = [40.92, 40.49, -74.27, -73.68];
const NORTH = 0, SOUTH = 1, WEST = 2, EAST = 3;
const LAT = 0, LONG = 1, SCOUNT = 2, ECOUNT = 3;
const KEY = 0, VALUE = 1;
var nsstreckung = 130.0

var stations = new Map();
var greybuffer = 5;
var max_count = Number.MIN_VALUE;
var min_score = Number.MAX_VALUE;
var max_score = Number.MIN_VALUE;
var score_scale_max;
var coordinates = d3.pointer(this);
var x = coordinates[0];
var y = coordinates[1];

function clamp(num, min, max){
    return Math.max(Math.min(num, Math.max(min, max)), Math.min(min, max));
}
d3.xml('res/nycmap.svg').then((nycmap) => {
    var map = d3.select("#map")
    var xm = d3.select("#xm").node()
    var ym = d3.select("#ym").node()
    var stationname = d3.select("#stationname").node()
    var stationdetails= d3.select("#stationdetails").node()
    map.node().append(nycmap.documentElement)
    var svg = map.select("svg")
    svgwpx = svg.style("width")
    svghpx = svg.style("height")
    svgw = parseInt(svgwpx)
    svgh = parseInt(svghpx)
    //console.log(svgw);
    //console.log(svgh);
    let xpix2coords = d3.scaleLinear()
        .domain([0, svgw])
        .range([limits[WEST], limits[EAST]]);

    let ypix2coords = d3.scaleLinear()
        .domain([0, svgh])
        .range([limits[NORTH], limits[SOUTH]]);
    
    let xcoords2pix = d3.scaleLinear()
        .domain([limits[WEST], limits[EAST]])
        .range([0, svgw]);

    let ycoords2pix = d3.scaleLinear()
        .domain([limits[NORTH], limits[SOUTH]])
        .range([0, svgh]);

    svg.on("mousemove", (event) => {    
        var coords = d3.pointer( event );
        xm.innerHTML = xpix2coords(clamp(coords[0], 0, svgw)).toString();
        ym.innerHTML = ypix2coords(clamp(coords[1], 0, svgh)).toString();
        //console.log(xpix2coords(clamp(coords[0], 0, svgw)), ypix2coords(clamp(coords[1], 0, svgh))); // log the mouse x,y position
    })
    console.time("totalTime:");
    Promise.all(
        [
            //NYC
            d3.csv('res/202303-citibike-tripdata/202303-citibike-tripdata.000.csv'),
            /*d3.csv('res/202303-citibike-tripdata/202303-citibike-tripdata.001.csv'),
            d3.csv('res/202303-citibike-tripdata/202303-citibike-tripdata.002.csv'),
            d3.csv('res/202303-citibike-tripdata/202303-citibike-tripdata.003.csv'),
            d3.csv('res/202303-citibike-tripdata/202303-citibike-tripdata.004.csv'),
            d3.csv('res/202303-citibike-tripdata/202303-citibike-tripdata.005.csv'),
            d3.csv('res/202303-citibike-tripdata/202303-citibike-tripdata.006.csv'),
            d3.csv('res/202303-citibike-tripdata/202303-citibike-tripdata.007.csv'),
            d3.csv('res/202303-citibike-tripdata/202303-citibike-tripdata.008.csv'),
            d3.csv('res/202303-citibike-tripdata/202303-citibike-tripdata.009.csv'),
            d3.csv('res/202303-citibike-tripdata/202303-citibike-tripdata.010.csv'),
            d3.csv('res/202303-citibike-tripdata/202303-citibike-tripdata.011.csv'),
            d3.csv('res/202303-citibike-tripdata/202303-citibike-tripdata.012.csv'),
            d3.csv('res/202303-citibike-tripdata/202303-citibike-tripdata.013.csv'),
            d3.csv('res/202303-citibike-tripdata/202303-citibike-tripdata.014.csv'),
            d3.csv('res/202303-citibike-tripdata/202303-citibike-tripdata.015.csv'),
            d3.csv('res/202303-citibike-tripdata/202303-citibike-tripdata.016.csv'),
            d3.csv('res/202303-citibike-tripdata/202303-citibike-tripdata.017.csv'),
            d3.csv('res/202303-citibike-tripdata/202303-citibike-tripdata.018.csv'),
            d3.csv('res/202303-citibike-tripdata/202303-citibike-tripdata.019.csv'),
            d3.csv('res/202303-citibike-tripdata/202303-citibike-tripdata.020.csv'),
            d3.csv('res/202303-citibike-tripdata/202303-citibike-tripdata.021.csv'),
            /*
            d3.csv('res/202302-citibike-tripdata.csv'),
            d3.csv('res/202301-citibike-tripdata.csv'),
            d3.csv('res/202212-citibike-tripdata.csv'),
            d3.csv('res/202211-citibike-tripdata.csv'),
            d3.csv('res/202210-citibike-tripdata.csv'),
            */
            //JERSEY CITY
            //d3.csv('res/JC-202303-citibike-tripdata.csv'),
        ]
    ).then((data) => {
        data.forEach(element => {
            map.select("svg")
                .selectAll("circle")
                .data(element)
                .join("circle")
                .attr("r", function(d){
                    var smapvals = [4];
                    var emapvals = [4];
                    smapvals[LAT] = +d.start_lat;
                    smapvals[LONG] = +d.start_lng;
                    emapvals[LAT] = +d.end_lat;
                    emapvals[LONG] = +d.end_lng;
                    if(stations.has(d.start_station_name))
                    {
                        smapvals[SCOUNT] = stations.get(d.start_station_name)[SCOUNT] + 1;
                        smapvals[ECOUNT] = stations.get(d.start_station_name)[ECOUNT];
                        stations.set(d.start_station_name, smapvals)
                    }
                    else
                    {
                        //console.log("New starting station: ", d.start_station_name)
                        smapvals[SCOUNT] =  1;
                        smapvals[ECOUNT] = 0;
                        stations.set(d.start_station_name, smapvals)
                    }
                    if(stations.has(d.end_station_name))
                    {
                        emapvals[ECOUNT] = stations.get(d.end_station_name)[ECOUNT] + 1;
                        emapvals[SCOUNT] = stations.get(d.end_station_name)[SCOUNT];
                        stations.set(d.end_station_name, emapvals);
                    }
                    else{
                        if(d.end_station_name == "Grove St - PATH")
                        {
                            grovestr = "Grove St PATH"
                            emapvals[ECOUNT] = stations.get(grovestr)[ECOUNT] + 1;
                            emapvals[SCOUNT] = stations.get(grovestr)[SCOUNT];
                            stations.set(grovestr, emapvals);
                        }
                        else
                        {
                            //console.log("New ending station: ", d.end_station_name)
                            emapvals[ECOUNT] = 1;
                            emapvals[SCOUNT] = 0;
                            stations.set(d.end_station_name, emapvals);
                        }
                    }
                    return 50;
                })
            
        });
        stations.forEach(entry => {
            if((entry[ECOUNT] - entry[SCOUNT])  > max_score)
            {
                max_score = (entry[ECOUNT] - entry[SCOUNT]) ;
            }
            if((entry[ECOUNT] - entry[SCOUNT])  < min_score)
            {
                min_score = (entry[ECOUNT] - entry[SCOUNT]) ;
            }
            if((entry[ECOUNT] + entry[SCOUNT]) > max_count)
            {
                max_count = (entry[ECOUNT] + entry[SCOUNT])
            }
        });
        score_scale_max = max_score;
        if(Math.abs(max_score) > Math.abs(min_score))
        {
            score_scale_max = Math.abs(min_score);
        }
        score_scale_max /= 4;
        //console.log(min_score, max_score, score_scale_max);
        var min_circle_r = 0.5;
        var max_circle_r = 2.5;
        let count2radius = d3.scaleSqrt()
            .domain([0, max_count])
            .range([min_circle_r, max_circle_r]);
        let score2redcolor = d3.scaleLinear()
            .domain([(-1 * score_scale_max / 2), score_scale_max])
            .range(["#f0eded","red"]);
        let score2bluecolor = d3.scaleLinear()
            .domain([(-1 * score_scale_max / 2), Math.abs(score_scale_max)])
            .range(["#f0eded","blue"]);
        d3.select("body").select("#map").select("svg")
            .selectAll("circle")
            .data(stations)
            .join("circle")
            .attr("cy", function(d){
                //console.log("Input: ", d[VALUE][LAT],"Output:", ycoords2pix(d[VALUE][LAT]));
                return ycoords2pix(d[VALUE][LAT]);
            })
            .attr("cx", function(d){
                //console.log("Input: ", d[VALUE][LONG],"Output:", xcoords2pix(d[VALUE][LONG]));
                return xcoords2pix(d[VALUE][LONG]);
            })
            .attr("r", function(d){
                return count2radius((d[VALUE][ECOUNT] + d[VALUE][SCOUNT]));
            })
            .attr("fill", function(d){
                score = (d[VALUE][ECOUNT] - d[VALUE][SCOUNT]);
                if(score > score_scale_max / 50)
                {
                    return score2redcolor(clamp(score, 0, score_scale_max));
                }
                else if (score < -1 * score_scale_max / 50)
                {
                    return score2bluecolor(Math.abs(clamp(Math.abs(score), 0, score_scale_max)));
                }
                else{
                    return "#f0eded";
                }
            })
            .attr('fill-opacity', 0.75)
            .attr('stroke', "#f0eded")
            .attr('stroke-width', '0.25')
            .on("mouseover", function(d, i){
                //console.log(i[KEY]);
                stationname.innerHTML = i[KEY];
                stationdetails.innerHTML = "Number of trips to: " + i[VALUE][ECOUNT];
                stationdetails.innerHTML += "</br>Number of trips from: " + i[VALUE][SCOUNT];
                stationdetails.innerHTML += "</br>Score value: " + ((i[VALUE][ECOUNT] - i[VALUE][SCOUNT]));
                d3.select(this)
                    .style("stroke", "black")
                    .attr('fill-opacity', 1)
                    .attr('stroke-width', '0.5')
            })
            .on("mouseout", function(){
                d3.select(this)
                    .style("stroke", "#f0eded")
                    .attr('stroke-width', '0.25')
                    .attr('fill-opacity', 0.75)
            })
            
    })
    
})