// @TODO: YOUR CODE HERE!
//height and width parameters
var svgWidth = 1000;
var svgHeight = 600;

// Margins 
var margin = {
  top: 40,
  right: 40,
  bottom: 80,
  left: 90
};

// Height and width based on margins
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Canvas for scatter points
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// chartGroup
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Data Import

var file = "assets/data/data.csv"

// d3 csv load from data.csv 
d3.csv("/assets/data/data.csv").then(successHandle, errorHandle);

// Error handling function
function errorHandle(error) {
  throw error;
} 

// Function takes in argument statesData
function successHandle(statesData) {

  statesData.map(function (data) {
    data.poverty = +data.poverty;
    data.obesity = +data.obesity;
  });

  //  Scale Functions
  var xLinearScale = d3.scaleLinear()
    .domain([8.1, d3.max(statesData, d => d.poverty)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([20, d3.max(statesData, d => d.obesity)])
    .range([height, 0]);

  var bottomAxis = d3.axisBottom(xLinearScale)
    // Bottom axis ticks 
    .ticks(7);
  var leftAxis = d3.axisLeft(yLinearScale);


  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis); 
  chartGroup.append("g")
    .call(leftAxis);


  // Scatter plot circles 
  var circlesGroup = chartGroup.selectAll("circle")
    .data(statesData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", "8")
    .attr("fill", "#788dc2")
    .attr("opacity", ".65")

  // text in radius
  var circlesGroup = chartGroup.selectAll()
    .data(statesData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.obesity))
    .style("font-size", "8px")
    .style("text-anchor", "middle")
    .style('fill', 'white')
    .text(d => (d.abbr));
  // label axes
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Obesity Percentage (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Percentage of Population in Poverty (%)");
}