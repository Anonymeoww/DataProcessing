d3v5.json("data.json").then(function(all_data){
    console.log(all_data);

    var map_data = format_data(all_data);
    create_map(map_data);
    create_bars(map_data, "NLD")
});

function format_data(data) {
    EUcountries = ['AUT', 'BEL', 'BG', 'BGR', 'HR', 'HRV', 'CYP', 'CZE', 'DNK', 'EST', 'FIN', 'FRA', 'DEU', 'GRC', 'HUN',
        'IRL', 'ITA', 'LVA', 'LTU', 'LUX', 'MLT', 'NLD', 'POL', 'PRT', 'RUS', 'ROU', 'SVK', 'SVN', 'ESP', 'SWE', 'GBR'];

    NAcountries = ['ATG', 'ABW', 'BHS', 'BRB', 'BLZ', 'BMU', 'BES', 'VGB', 'CAN', 'CYM', 'CRI', 'CUB', 'CUW', 'DMA', 'DOM',
        'SLV', 'GRL', 'GRD', 'GLP', 'GTM', 'HTI', 'HND', 'JAM', 'MTQ', 'MEX', 'SPM', 'MSR', 'ANT', 'KNA', 'NIC', 'PAN',
        'PRI', 'BES', 'SXM', 'LCA', 'SPM', 'VCT', 'TTO', 'TCA', 'USA', 'VIR'];

    Othercountries = ['AFG', 'ARM', 'AZE', 'BHR', 'BGD', 'BTN', 'BRN', 'KHM', 'CHN', 'CXR', 'CCK', 'IOT', 'GEO', 'HKG',
        'IND', 'IDN', 'IRN', 'IRQ', 'ISR', 'JOR', 'KAZ', 'KWT', 'KGZ', 'LAO', 'LBN', 'MAC', 'MYS', 'MDV', 'MNG', 'MMR',
        'NPL', 'PRK', 'OMN', 'PAK', 'PSE', 'PHL', 'QAT', 'SAU', 'SGP', 'KOR', 'LKA', 'SYR', 'TWN', 'TJK', 'THA', 'TUR',
        'TKM', 'ARE', 'UZB', 'VNM', 'YEM'];

    var country_dict = {};

    EUcountries.forEach(function (euCountry) {
        country_dict[euCountry] = {
            Total: data["EU"].Total,
            Genres: data["EU"]["Genres"]
        }
    });

    NAcountries.forEach(function (naCountry) {
        country_dict[naCountry] = {
            Total: data["USA"].Total,
            Genres: data["USA"]["Genres"]
        }
    });

    Othercountries.forEach(function (othercountries) {
        country_dict[othercountries] = {
            Total: data["Other"].Total,
            Genres: data["Other"]["Genres"]
        }
    });

    country_dict["JPN"] = {
        Total: data["JPN"].Total,
        Genres: data["JPN"]["Genres"]
    };

    // create color palette function
    // color can be whatever you wish
    var paletteScale = function (color) {
        if (color > 0 && color < 4000) {
            return "#FEA9BD"
        }
        if (color > 4000 && color < 8000) {
            return "#FE7F9C"
        }
        if (color > 8000) {
            return "#B95D72"
        }
    };

    Object.keys(country_dict).forEach(function (a) {
        //console.log(country_dict[a].Total);
        country_dict[a]["fillColor"] = paletteScale(country_dict[a].Total)
    });
    console.log(country_dict);
    return country_dict
}

function create_map(map_data) {

    var map = new Datamap({
        element: document.getElementById('container'),
        fills: {
            defaultFill: 'grey'
        },
        data: map_data,
        geographyConfig: {
            highlightBorderWidth: 3,
            popupTemplate: function (geography, dataset) {
                return ["<div class='hoverinfo'>", geography.properties.name, "</br> Total revenue: ", dataset.Total, "</div>"].join('');
            },
        },
        done: function(map) {
            map.svg.selectAll('.datamaps-subunit').on('click', function (geography) {
                console.log(geography.id);
                d3v5.selectAll("#barSVG").remove();
                create_bars(map_data, geography.id);
            });
        }
    });

}

function create_bars(map_data, country_id) {

    var get_genres = map_data[country_id]["Genres"];

    var genres = Object.values(get_genres);
    console.log(genres)

    d3v5.select(".container-barchart").append("svg")
        .attr("width", 600)
        .attr("height", 300)
        .attr("id", "barSVG");

    //SVG
    var svg = d3v5.select("#barSVG");
    var h = svg.attr('height');
    var w = svg.attr('width');

    var genrelist = Object.keys(get_genres);

    var xScale = d3v5.scaleBand()
                    .domain(genrelist)
                    .range([60, w ]);

    var yScale = d3v5.scaleLinear()
        .domain([1500, 0])
        .range([0, h - 100]);

    // Define the axes
    var xAxis = d3v5.axisBottom(xScale);
        //.text("Hallo");

    // Text label for barchart
    svg.append("text")
        .attr("transform",
            "translate(" + (w / 2+ 50) + " ," +
            (25) + ")")
        .style("text-anchor", "middle")
        .text('Revenue per category for '+ country_id);

    // // Text label for the x axis
    // svg.append("text")
    //     .attr("transform",
    //         "translate(" + (w / 2) + " ," +
    //         (h - 20) + ")")
    //     .style("text-anchor", "middle")
    //     .text("Categories");

    var yAxis = d3v5.axisLeft(yScale);

    // Text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 10)
        .attr("x", 0 - (h / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Revenue");

    var bars = svg.selectAll("rect")
        .data(genrelist)
        .enter()
        .append("rect")
        .attr("class", "bar");

    var ypos = 0;
    bars.attr("x", function (d, i) {
        return xScale(d);
    })
        .attr("y", function (d, i) {
            var barheight = yScale(get_genres[d]);
            ypos = h - barheight;
            return ypos - 50;
        })
        .attr("width", xScale.bandwidth())
        .attr("fill", "pink")
        .attr("stroke", 'black')
        .attr("height", function (d) {
            console.log(d);
            console.log(get_genres[d]);
            console.log(yScale(get_genres[d]));
            return yScale(get_genres[d])
        });

    // Draw axes
    svg.append("g").attr("transform", "translate(0, " + (h - 50) + ")").call(xAxis);
    svg.append("g").attr("transform", "translate(60, " + (50) + ")").call(yAxis);

}