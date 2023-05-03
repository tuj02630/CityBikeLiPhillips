(function() { 



    const data = [
        {year: 2013, trips: 5614888},
        {year: 2014, trips: 8081216},
        {year: 2015, trips: 9937969},
        {year: 2016, trips: 13845655},
        {year: 2017, trips: 16364657},
        {year: 2018, trips: 17548339},
        {year: 2019, trips: 20551697},
        {year: 2020, trips: 19506857},
    ];

    const newData = [
        {year: 2013, bikes: 693454},
        {year: 2014, bikes: 994367},
        {year: 2015, bikes: 1230929},
        {year: 2016, bikes: 1418407},
        {year: 2017, bikes: 1358396},
        {year: 2018, bikes: 471309},
        {year: 2019, bikes: 517234},
        {year: 2020, bikes: 355182},
    ];


    /*const percent = [
        {year: 2013, number: 12.35},
        {year: 2014, number: 12.31},
        {year: 2015, number: 12.39},
        {year: 2016, number: 10.60},
        {year: 2017, number: 8.67},
        {year: 2018, number: 2.69},
        {year: 2019, number: 2.52},
        {year: 2020, number: 1.82},
    ]*/
    const width = 800;
    const height = 400;
    const margin = {top: 20, right: 20, bottom: 30, left: 60};

    // Create a tooltip div element
    const tooltip = d3.select("#barchart1")
        .append("div")
        .style("position", "absolute")
        .style("background", "white")
        .style("padding", "5px")
        .style("border", "1px solid black")
        .style("border-radius", "5px")
        .style("visibility", "hidden");

    const x = d3.scaleBand()
        .domain(data.map(d => d.year))
        .rangeRound([margin.left, width - margin.right])
        .padding(0.3);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.trips)]).nice()
        .range([height - margin.bottom, margin.top]);

    const xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .attr("font-size", "16px");

    const yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickFormat(function(d) { return d / 1000000 + "M"; }))
        .attr("font-size", "16px")
        //.call(g => g.select(".domain").remove());


    const color = d3.scaleOrdinal()
        .domain([...data.map(d => d.year), ...newData.map(d => d.year)])
        .range([...d3.schemePastel1, ...d3.schemeCategory10]);


    const darkerColor = d3.scaleOrdinal()
        .domain([...data.map(d => d.year), ...newData.map(d => d.year)])
        .range([...d3.schemePastel1, ...d3.schemeCategory10]);
    
    //buttons


    // Create a container div for buttons
    const buttonContainer = d3.select("#barchart1")
        .append("div")
        .style("display", "flex")
        .style("justify-content", "center")
        .style("margin-top", "20px");
    // Add a button to toggle the display of newData bars

    buttonContainer
        .append("button")
        .attr("id", "toggleButton")
        .text("Separate")
        .style("background-color", "rgb(11, 69, 117)")
        .style("color", "white")
        .style("border", "none")
        .style("padding", "10px 20px")
        .style("margin-right", "10px")
        .style("cursor", "pointer");


    // Add a button to return to the original overlapped bar chart
    buttonContainer
        .append("button")
        .attr("id", "resetButton")
        .text("Overlap")
        .style("background-color", "#f44336")
        .style("color", "white")
        .style("border", "none")
        .style("padding", "10px 20px")
        .style("cursor", "pointer");



    //barchart
    const svg = d3.select("#barchart1").append("svg")
        .attr("width", width)
        .attr("height", height);

    const bars = svg.append("g")
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.year))
        .attr("y", d => y(d.trips))
        .attr("height", d => y(0) - y(d.trips))
        .attr("width", x.bandwidth())
        .attr("fill", d => color(d.year))
        .on("mouseover", (event, d) => {
            tooltip.html(`Trips: ${d.trips.toLocaleString()}`)
                .style("visibility", "visible");
        })
        .on("mousemove", (event) => {
            tooltip.style("top", (event.pageY - 10) + "px")
                .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", () => {
            tooltip.style("visibility", "hidden");
        });

    
    const bars1 = svg.append("g")
        .selectAll("rect")
        .data(newData)
        .join("rect")
        .attr("class", "bar1")
        .attr("x", d => x(d.year))
        .attr("y", d => y(d.bikes))
        .attr("height", d => y(0) - y(d.bikes))
        .attr("width", x.bandwidth())
        .attr("fill", d => darkerColor(d.year))
        .on("mouseover", (event, d) => {
            tooltip.html(`Re_Bikes: ${d.bikes.toLocaleString()}`)
                .style("visibility", "visible");
            })
        .on("mousemove", (event) => {
            tooltip.style("top", (event.pageY - 10) + "px")
                .style("left", (event.pageX + 10) + "px");
            })
        .on("mouseout", () => {
            tooltip.style("visibility", "hidden");
            });
            let newDataDisplayed = false;

    d3.select("#toggleButton").on("click", function() {
        newDataDisplayed = !newDataDisplayed;

        // Update the button text based on the displayed bars
        d3.select(this).text(newDataDisplayed ? "Rebalanced Bikes" : "Total Trips");
        
        bars.transition()
            .duration(500)
            .style("opacity", newDataDisplayed ? 0 : 1)
            .attr("pointer-events", newDataDisplayed ? "none" : "all");

        y.domain([0, d3.max(newDataDisplayed ? newData : data, d => newDataDisplayed ? d.bikes : d.trips)]).nice();

        yAxisGroup.transition().duration(500).call(yAxis);

        bars1.transition()
            .duration(500)
            .attr("y", d => y(newDataDisplayed ? d.bikes : 0))
            .attr("height", d => y(0) - y(newDataDisplayed ? d.bikes : 0));
        });
    
    d3.select("#resetButton").on("click", function() {
            newDataDisplayed = false;
            
            bars.transition()
                .duration(500)
                .style("opacity", 1)
                .attr("pointer-events", "all");
    
            y.domain([0, d3.max(data, d => d.trips)]).nice();
    
            yAxisGroup.transition().duration(500).call(yAxis);
    
            bars1.transition()
                .duration(500)
                .attr("y", d => y(d.bikes))
                .attr("height", d => y(0) - y(d.bikes));
        });
        
    svg.append("g")
        .call(xAxis);

    const yAxisGroup = svg.append("g")
        .call(yAxis);

   


})();