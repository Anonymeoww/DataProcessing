window.onload = function() {
    d3.select("head").append("title").text("Bar Chart");
    d3.select("body").append("p")
        .text("This bar chart is about the top 100 songs of Spotify in 2018.")
        .style("color", "pink")
        .style("font-family", "Courier");
    d3.select("body").append("p").text("This bar chart is made by Dilisha C. Jethoe (12523186)")
        .style("font-family", "Courier");
    d3.json("top2018.json").then(function (data) {
        // d3.select("body").selectAll("p")
        //     .data(data)
        //     .enter()
        //     .append("p")
        //     .text(function (d) {
        //         return d["danceability"];
        //     });

        //SVG
        var svg = d3.select("#barSVG");
        var h = svg.attr('height');
        var w = svg.attr('width');

        // Scale functions
        var xScale = d3.scaleLinear()
                       .domain([0, 100])
                       .range([0, w]);

        var yScale = d3.scaleLinear()
                     .domain([0, 1])
                     .range([0, h - 20]);

        // Define the axis
        var xAxis = d3.axisBottom(xScale)
                      .ticks(10)


        var yAxis = d3.axisRight(yScale)
                      .tickValues([0.5])

        svg.append("g").attr("transform", "translate(0, " + (h-20) + ")").call(xAxis)
        svg.append("g").call(yAxis)

        console.log(svg.selectAll("rect"))
        var bars = svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect");

        var ypos = 0;
        bars.attr("x", function (d, i) {
            return i * 8;
        })
            .attr("y", function (d) {
                var barheight = d['danceability'] * 100
                ypos = 400 - barheight;
                return ypos;
            })
            .attr("width", 8)
            .attr("fill", "pink")
            .attr("stroke", 'black')
            .attr("height", function (d) {
                return d['danceability'] * 100;
            });
    });
};
