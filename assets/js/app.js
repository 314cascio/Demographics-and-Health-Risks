// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select(".container")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup1 = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
var chartGroup2 = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
 var chartGroup3 = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Import Data
d3.csv("censusData.csv") 
  .then(function(censusData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    censusData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.smokes = +data.smokes;
      data.smokesLow = +data.smokesLow;
      data.smokesHigh = +data.smokesHigh;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(censusData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([8, d3.max(censusData, d => d.smokesHigh)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup1.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup1.append("g")
      .call(leftAxis);
    
    chartGroup2.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup2.append("g")
      .call(leftAxis);

    chartGroup3.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup3.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup1 = chartGroup1.append("g").selectAll("circle")
      .data(censusData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.smokes))
      .attr("r", "15")
      .attr("fill", "brown")
      .attr("opacity", ".4");
    
      var text1 = chartGroup1.selectAll("text")
      .data(censusData)
      .enter()
      .append("text");
    
      var textLabels1 = text1
        .attr("x", function(d) { return xLinearScale(d.poverty) -7 } ) 
        .attr("y", function(d) { return  yLinearScale(d.smokes) })
        .text( function (d) { return (d.abbr); })
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .attr("fill", "white");

    var circlesGroup2 = chartGroup2.append("g").selectAll("circle")
      .data(censusData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.smokesHigh))
      .attr("r", "15")
      .attr("fill", "red")
      .attr("opacity", ".5");
    
      var text2 = chartGroup2.selectAll("text")
      .data(censusData)
      .enter()
      .append("text");
    
      var textLabels2 = text2
        .attr("x", function(d) { return xLinearScale(d.poverty) -7 } ) 
        .attr("y", function(d) { return  yLinearScale(d.smokesHigh) })
        .text( function (d) { return (d.abbr); })
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .attr("fill", "white");
      
    var circlesGroup3 = chartGroup3.append("g").selectAll("circle")
      .data(censusData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.smokesLow))
      .attr("r", "15")
      .attr("fill", "orange")
      .attr("opacity", ".5")
      
      var text3 = chartGroup3.selectAll("text")
        .data(censusData)
        .enter()
        .append("text");
      
      var textLabels3 = text3
        .attr("x", function(d) { return xLinearScale(d.poverty) -7 } ) 
        .attr("y", function(d) { return  yLinearScale(d.smokesLow) })
        .text( function (d) { return (d.abbr); })
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .attr("fill", "white");

      // Line of Regression
      var line = d3.line()
      .xLinearScale(function(d) { return x(d.poverty)})
      .yLinearScale(function(d) { return y(regression(d.smokes))});
      
      svg.append("path")
      .datum(censusData)
      .attr("class", "line")
      .attr("d", line);

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip1 = d3.tip()
      .attr("class", "tooltip")
      .html(function(d) {
        return (`<strong>${d.smokes} Percent of ${d.abbr}'s residents smoke. ${d.poverty} percent live in poverty. </strong>`);
      });
    
    var toolTip2 = d3.tip()
      .attr("class", "tooltip")
      .html(function(d) {
        return (`<strong>${d.smokesHigh} Percent of ${d.abbr}'s residents smoke. ${d.poverty} percent live in poverty. </strong>`);
      });

    var toolTip3 = d3.tip()
      .attr("class", "tooltip")
      .html(function(d) {
        return (`<strong>${d.smokesLow} Percent of ${d.abbr}'s residents smoke. ${d.poverty} percent live in poverty. </strong>`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup1.call(toolTip1);
    chartGroup2.call(toolTip2);
    chartGroup3.call(toolTip3);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup1.on("click", function(d) {
      toolTip1.show(d, this);
    })
      // onmouseout event
      .on("mouseout", function(d, index) {
        toolTip1.hide(d);
      });
    
    circlesGroup2.on("click", function(d) {
      toolTip2.show(d, this);
    })
      // onmouseout event
      .on("mouseout", function(d, index) {
         toolTip2.hide(d);
      });

    circlesGroup3.on("click", function(d) {
      toolTip3.show(d, this);
    })
      // onmouseout event
      .on("mouseout", function(d, index) {
          toolTip3.hide(d);
      });

    // Create axes labels
    chartGroup1.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height - 100))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Percent of State Residents who Smoke");

    chartGroup1.append("text")
      .attr("transform", `translate(${width / 2.5}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Percent of State Residents in Poverty");
  });