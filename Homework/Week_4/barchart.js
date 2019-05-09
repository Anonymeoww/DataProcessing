window.onload = function() {
    d3.select("head").append("title")
                     .text("Bar Chart Spotify Danceability");
    d3.select(".container-barchart").append("h3")
                     .text("Bar Chart: Danceability of the Top Spotify tracks 2018");
    d3.select(".container-barchart").append("p")
                     .text("Look at this bar chart. It will tell you about the danceability of Spotify's top 100 " +
                         "tracks of 2018. Appearently, many people are into music that is suitable for dancing. " +
                         "Luckily, there are still some ballads in there!");
    d3.select(".container-barchart").append("svg")
                     .attr("width", 1200)
                     .attr("height", 400)
                     .attr("id", "barSVG");
    d3.select(".footer-barchart")
                     .append("p")
                     .text("This bar chart is made by Dilisha C. Jethoe (12523186)")
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
        var xAxis = d3.axisBottom(xScale);

        // Text label for the x axis
        svg.append("text")
            .attr("transform",
                "translate(" + (w / 2) + " ," +
                (h - 20) + ")")
            .style("text-anchor", "middle")
            .text("Songs");

        var yAxis = d3.axisLeft(yScale)
            .tickValues([1, 0.5]);

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
            .append("rect")
            .attr("class", "bar");

        // Tooltip
        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([50, 0])
            .html(function (d) {
                return "<strong>Danceability:</strong> <span>" + d['danceability'] + "</span> <br>" +
                    "<strong>Song Title</strong> <span>" + d['name'] + "</span>";
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
            .attr("width", 12)
            .attr("fill", "pink")
            .attr("stroke", 'black')
            .attr("height", function (d) {
                return yScale(d['danceability'])
            })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

        // Draw axes
        svg.append("g").attr("transform", "translate(40, " + (h - 50) + ")").call(xAxis);
        svg.append("g").attr("transform", "translate(40, " + (0) + ")").call(yAxis);
        svg.call(tip);

        });
    };

