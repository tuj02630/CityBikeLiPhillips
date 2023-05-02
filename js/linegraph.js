(function() { 
  
    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // parse the date / time
    var parseTime = d3.timeParse("%Y-%m-%d");

    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // define the line
    var valueline = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.trips); });

    var valueline_2 = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.bikes); });

    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#linegraph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // create a tooltip div
    var tooltip = d3.select("#linegraph").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // get the data
    Promise.all([
        d3.csv("./output/trips_per_day_2013_12.csv"), 
        d3.csv("./output/rebalance_per_day_2013_12.csv") 
    ]).then((data) => {
        const trips = data[0];
        const rebalance = data[1];

        // format the data
        trips.forEach(function(d) {
            d.date = parseTime(d.date);
            d.trips = +d.trips;
        });

        rebalance.forEach(function(d) {
            d.date = parseTime(d.date);
            d.bikes = +d.bikes;
        });

        // scale the range of the data
        x.domain(d3.extent(trips, function(d) { return d.date; }));
        y.domain([0, d3.max(trips, function(d) { return d.trips; })]);


        // add the valueline path.
        var path = svg.append("path")
            .data([trips])
            .attr('fill', 'none')
            .attr('stroke', 'blue')
            .attr("class", "line")
            .attr("d", valueline);

        var path_2 = svg.append("path")
            .data([rebalance])
            .attr("class", "rebalance-line")
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("d", valueline_2)
            .style("opacity", 1);

        // add circles and mouseover functionality for trips line
        svg.selectAll(".trips-dot")
            .data(trips)
            .enter().append("circle")
            .attr("class", "trips-dot")
            .attr("cx", function(d) { return x(d.date); })
            .attr("cy", function(d) { return y(d.trips); })
            .attr("r", 3)
            .on("mouseover", function(event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html("Date: " + d.date.toLocaleDateString() + "<br/>Trips: " + d.trips)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 10) + "px");
            })
            .on("mousemove", function(event) {
                tooltip.style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 10) + "px");
            })
            .on("mouseout", function() {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        // add circles and mouseover functionality for rebalance line
        svg.selectAll(".rebalance-dot")
            .data(rebalance)
            .enter().append("circle")
            .attr("class", "rebalance-dot")
            .attr("cx", function(d) { return x(d.date); })
            .attr("cy", function(d) { return y(d.bikes); })
            .attr("r", 3)
            .attr("fill", "red")
            .on("mouseover", function(event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html("Date: " + d.date.toLocaleDateString() + "<br/>Rebalanced bikes: " + d.bikes)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 10) + "px");
            })
            .on("mousemove", function(event) {
                tooltip.style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 10) + "px");
            })
            .on("mouseout", function() {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

    

        // add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // add the Y Axis
        svg.append("g")
            .call(d3.axisLeft(y));

        // add the title
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 2 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Citi Bike");
 
        // Hide the lines and dots initially
        svg.selectAll(".line, .rebalance-line, .trips-dot, .rebalance-dot")
            .style("opacity", 0);

  

        // define function to animate line
        function animateLine(line) {
            var totalLength = line.node().getTotalLength();
            line.attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                .duration(2500)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0);

            if(line == path){
                svg.selectAll(".line, .trips-dot")
                .style("opacity", 1);
            
              // hide dots before animation
              svg.selectAll(".trips-dot")
                  .style("opacity", 0);
              
              // show dots after animation
              line.transition()
                  .duration(2500)
                  .ease(d3.easeLinear)
                  .attr("stroke-dashoffset", 0)
                  .on("end", function() {
                    svg.selectAll(".trips-dot")
                        .transition()
                        .duration(500)
                        .style("opacity", 1);
                  });
            }
            
            if(line == path_2){
                svg.selectAll(".rebalance-line, .rebalance-dot")
                .style("opacity", 1);
            
              // hide dots before animation
              svg.selectAll(".rebalance-dot")
                  .style("opacity", 0);
              
              // show dots after animation
              line.transition()
                  .duration(2500)
                  .ease(d3.easeLinear)
                  .attr("stroke-dashoffset", 0)
                  .on("end", function() {
                    svg.selectAll(".rebalance-dot")
                        .transition()
                        .duration(500)
                        .style("opacity", 1);
                  });
            }
           
          }

        

        // create buttons to start animations
        d3.select("#linegraph")
            .append("button")
            .text("Animate Blue Line")
            .on("click", function() {
                animateLine(path);
            });

        d3.select("#linegraph")
            .append("button")
            .text("Animate Red Line")
            .on("click", function() {
                animateLine(path_2);
            });

    });

     
})();
  