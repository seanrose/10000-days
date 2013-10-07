// Hardcoded at 75 days (the name of this project no longer makes sense!)
var NUMDAYS = 27393;
var ONEDAY = 86400000;
var STARTPARAM = "start";

/**
*   createGrid    Setup a 10,000 Day Grid
*                    Grid is dynamically sized based on viewport
*
*   @param id     div id tag starting with #
*/

function createGrid(id)
{

    var dimensions = gridDimensions();
    console.log(dimensions);
    var numFilled = calculateDays(getParameterByName(STARTPARAM));
    var data = gridData(dimensions.numRows, dimensions.numColumns, dimensions.cellSize, numFilled);

    var grid = d3.select(id).append("svg")
                    .attr("width", dimensions.width)
                    .attr("height", dimensions.height)
                    .attr("class", "chart");

    var row = grid.selectAll(".row")
                .data(data)
                .enter().append("svg:g")
                  .attr("class", "row");

    var col = row.selectAll(".cell")
                .data(function (d) { return d; })
                .enter().append("svg:rect")
                .attr("class", "cell")
                .attr("x", function(d) { return d.x; })
                .attr("y", function(d) { return d.y; })
                .attr("width", dimensions.cellSize)
                .attr("height", dimensions.cellSize)
                .attr("fill", "rgb(255, 250, 250)")
                .attr("stroke", "#FFF")
                .transition()
                .delay(function(d) {
                    return 20 * d.y;
                })
                .duration(500)
                .ease("cubic-in-out")
                .attr("stroke", "#B5B7AB")
                .attr("fill", function(d) {
                    return d.filled ? "rgb(220, 97, 85)" : "rgb(203, 223, 149)";
                });

}

function gridDimensions() {

    // Calculate the area of the viewport
    var viewportWidth = document.documentElement.clientWidth;
    var viewportHeight = document.documentElement.clientHeight;
    var viewportArea = viewportHeight * viewportWidth;
    // Divide viewport area by number of days to get cell size
    var cellSize = Math.sqrt(viewportArea / NUMDAYS);

    // Row Length is the number of
    var rowLength = Math.floor(viewportWidth / cellSize);
    var columnHeight = Math.floor(viewportHeight / cellSize);

    return {
        cellSize: cellSize,
        width: viewportWidth,
        height: viewportHeight,
        numColumns: rowLength,
        numRows: columnHeight
    };
}

function gridData(numRows, numColumns, cellSize, numFilled) {

    var data = [];
    // Initialize the empty grid
    var grid = [];
    for (var rowIndex = 0; rowIndex < numRows; rowIndex++) {
        grid.push(new Array(numColumns));
    }

    // Populate the grid with number of filled squares
    for (var row = 0; row < grid.length; row++) {
        data.push([]);
        for (col = 0; col < grid[0].length; col++) {
            var cell = {
                x: col * cellSize,
                y: row * cellSize,
                width: cellSize,
                height: cellSize,
                filled: numFilled > 0
            };
            data[row].  push(cell);
            numFilled--;
        }
    }

    return data;
}

function calculateDays(startDate) {

    var dateArray = startDate.split("-");
    var d = new Date(parseInt(dateArray[2]), parseInt(dateArray[0]) - 1, parseInt(dateArray[1]));
    return Math.round(Math.abs((Date.now() - d.getTime())/ONEDAY));

}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}