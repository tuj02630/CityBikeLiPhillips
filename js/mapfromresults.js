var svgw = 0;
var svgh = 0;
var limits = [40.92, 40.49, -74.27, -73.68];
const NORTH = 0, SOUTH = 1, WEST = 2, EAST = 3;
const START = 0, END = 1, LAT = 2, LNG = 3;
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
    console.log(svgw);
    console.log(svgh);
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
    console.log("I am here")
    var stops=[];

    Promise.all(
        [
            d3.json('/results/input_output.json'),
            //NYC 
            
            d3.csv('res/202303-citibike-tripdata/202303-citibike-tripdata.000.csv'),
            d3.csv('res/202303-citibike-tripdata/202303-citibike-tripdata.001.csv'),
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
            
            
            /*d3.csv('res/202302-citibike-tripdata.csv'),
            d3.csv('res/202301-citibike-tripdata.csv'),
            d3.csv('res/202212-citibike-tripdata.csv'),
            d3.csv('res/202211-citibike-tripdata.csv'),
            d3.csv('res/202210-citibike-tripdata.csv'),
            */
            //JERSEY CITY
            d3.csv('res/JC-citibike-tripdata/JC-202303-citibike-tripdata.csv'),
        ]
    ).then((data) => {
        console.log("I am here")
        data.forEach(element => {
            //console.log(element);
            for(const key in element){
                if(!stops.includes(key))
                {
                    stops.push(key);
                    console.log(key +" [" + element[key] + "]")
                    if(element[key][START] + element[key][END] > max_count)
                    {
                        max_count = element[key][START] + element[key][END];
                    }
                    if((element[key][END] - element[key][START])  > max_score)
                    {
                        max_score = (element[key][END] - element[key][START]) ;
                    }
                    if((element[key][END] - element[key][START])  < min_score)
                    {
                        min_score = (element[key][END] - element[key][START]) ;
                    }
                    score_scale_max = max_score;
                    if(Math.abs(max_score) > Math.abs(min_score))
                    {
                        score_scale_max = Math.abs(min_score);
                    }
                    score_scale_max /= 3;
                }      
            }
            var min_circle_r = 0.75;
            var max_circle_r = 4.5;
            var opacity = '0.25'
            let score2redcolor = d3.scaleLinear()
                .domain([(-1 * score_scale_max / 2), score_scale_max])
                .range(["#f0eded","#ca0020"]);
            let score2bluecolor = d3.scaleLinear()
                .domain([(-1 * score_scale_max / 2), Math.abs(score_scale_max)])
                .range(["#f0eded","#0571b0"]);
            let score2redcenter = d3.scaleLinear()
                .domain([(-1 * score_scale_max / 2), score_scale_max])
                .range(["black","#ca0020"]);
            let score2bluecenter = d3.scaleLinear()
                .domain([(-1 * score_scale_max / 2), Math.abs(score_scale_max)])
                .range(["black","#0571b0"]);
            let count2radius = d3.scaleSqrt()
                .domain([0, max_count])
                .range([min_circle_r, max_circle_r]);    

            d3.select("body").select("#map").select("svg")
                .selectAll("circle")
                .data(stops)
                .join("circle")
                .attr("cy", function(d){
                    return ycoords2pix(element[d][LAT]);
                })
                .attr("cx", function(d){
                    return xcoords2pix(element[d][LNG]);
                })
                .attr("r", function(d){
                    return count2radius((element[d][START] + element[d][END]));
                })

                .attr("fill", function(d){  
                    score = (element[d][END] - element[d][START]);
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
                .attr('fill-opacity', opacity)
                .attr('stroke', "none")
                .attr('stroke-width', '0')
                .on("mouseover", function(d, i){
                    console.log(i, element[i]);
                    stationname.innerHTML = i;
                    stationdetails.innerHTML = "Number of trips to: " + element[i][END];
                    stationdetails.innerHTML += "</br>Number of trips from: " + element[i][START];
                    stationdetails.innerHTML += "</br>Score value: " + ((element[i][END] - element[i][START]));
                    d3.select(this)
                        .style("stroke", "black")
                        .attr('fill-opacity', 1)
                })    
                .on("mouseout", function(){
                    d3.select(this)
                        .style("stroke", "none")
                        .attr('stroke-width', '0')
                        .attr('fill-opacity', opacity)
                })
                .append("circle")
                .attr('cx', function(d){
                    return xcoords2pix(element[d][LNG]);
                })
                .attr("cy", function(d){
                    return ycoords2pix(element[d][LAT]);
                })
                .attr("fill", function(d){  
                    score = (element[d][END] - element[d][START]);
                    if(score > score_scale_max / 50)
                    {
                        return score2redcenter(clamp(score, 0, score_scale_max));
                    }
                    else if (score < -1 * score_scale_max / 50)
                    {
                        return score2bluecenter(Math.abs(clamp(Math.abs(score), 0, score_scale_max)));
                    }
                    else{
                        return "#black";
                    }
                })
                .attr("r", "0.5")                     
            //console.log(stops);       
        })
        
    })

})