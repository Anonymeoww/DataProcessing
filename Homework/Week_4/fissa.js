window.onload = function() {
    d3.select("body").append("p")
        .text("This bar chart is about the top 100 songs of Spotify in 2018.")
        .style("color", "pink")
        .style("font-family", "Courier");
    d3.select("body").append("p").text("This bar chart is made by Dilisha C. Jethoe (12523186)")
        .style("font-family", "Courier");
    d3.json("top2018.json").then(function (data) {

        //SVG
        var svg = d3.select("#barSVG");
        var h = svg.attr('height');
        var w = svg.attr('width');

        // Scale functions
        var xScale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, w - 50]);

        var yScale = d3.scaleLinear()
            .domain([0, 1])
            .range([0, h - 50]);

        // Define the axes
        var xAxis = d3.axisBottom(xScale)

        // Text label for the x axis
        svg.append("text")
            .attr("transform",
                "translate(" + (w / 2) + " ," +
                (h - 20) + ")")
            .style("text-anchor", "middle")
            .text("Songs");

        var yAxis = d3.axisLeft(yScale)
            .tickValues([0.5]);

        // Text label for the y axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr("x", 0 - (h / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Danceability");

        var bars = svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect");

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function (d) {
                return "<strong>Danceability:</strong> <span style='color:black'>" + d['danceability'] + "</span>";
            });

        var ypos = 0;
        bars.attr("x", function (d, i) {
            return xScale(i) + 40;
        })
            .attr("y", function (d) {
                var barheight = yScale(d['danceability']);
                ypos = h - barheight;
                return ypos - 50;
            })
            .attr("width", 8)
            .attr("fill", "pink")
            .attr("stroke", 'black')
            .attr("height", function (d) {
                return yScale(d['danceability'])
            })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);


        svg.append("g").attr("transform", "translate(40, " + (h - 50) + ")").call(xAxis);
        svg.append("g").attr("transform", "translate(40, " + (0) + ")").call(yAxis);
        svg.call(tip);

        });

    }

