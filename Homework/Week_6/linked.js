d3v5.json("data.json").then(function(data){

  EUcountries = ['AUT', 'BEL', 'BG', 'BGR', 'HR', 'HRV', 'CYP', 'CZE', 'DNK', 'EST', 'FIN', 'FRA', 'DEU', 'GRC', 'HUN',
      'IRL', 'ITA', 'LVA', 'LTU', 'LUX', 'MLT', 'NLD', 'POL', 'PRT', 'ROU', 'SVK','SVN', 'ESP', 'SWE', 'GBR'];

  NAcountries = ['ATG', 'ABW', 'BHS', 'BRB', 'BLZ', 'BMU', 'BES', 'VGB', 'CAN', 'CYM', 'CRI', 'CUB', 'CUW','DMA', 'DOM',
       'SLV', 'GRL', 'GRD', 'GLP', 'GTM', 'HTI', 'HND', 'JAM', 'MTQ', 'MEX', 'SPM', 'MSR', 'ANT', 'KNA', 'NIC', 'PAN',
       'PRI', 'BES', 'SXM', 'LCA', 'SPM', 'VCT', 'TTO', 'TCA', 'USA', 'VIR'];

  EUcountries.forEach(function(euCountry){
    data["EU"][euCountry] = {
      Total: data["EU"].Total,
      Genres: data["EU"]["Genres"]
    }
  });

  NAcountries.forEach(function(naCountry){
    data["USA"][naCountry] = {
      Total: data["USA"].Total
    }
  });

  // var onlyValues = [];
  //
  // Object.keys(data).forEach(function (a) {
  //   onlyValues.push(data[a]["Total"]);
  //   return (data[a]["Total"])
  // });
  // console.log(onlyValues)
  //
  // // colors should be uniq for every value.
  // // For this purpose we create palette(using min/max series-value)
  // var minValue = Math.min.apply(null, onlyValues),
  //       maxValue = Math.max.apply(null, onlyValues);

  // create color palette function
  // color can be whatever you wish
  var paletteScale = function    (color){
        if (color > 0.0 && color < 400) {return "#FEA9BD"}
        if (color > 400.0 && color < 800) {return "#FE7F9C"}
        if (color > 800.0) {return "#B95D72"}
  };

  var dataset = {};

  Object.keys(data).forEach(function (a) {
    Object.keys(data[a]).forEach(function (k) {
      dataset[k] = {
        Total: data[a][k].Total,
        Genres: data[a][k].Genres,
        fillColor: paletteScale(data[a][k].Total)
        };
    })
  });

  // console.log(dataset);

  var map = new Datamap({
    element: document.getElementById('container'),
    fills: {
    defaultFill: 'grey'
    },
    data: dataset,
    geographyConfig: {
      highlightBorderWidth: 3,
      popupTemplate: function(geography, dataset) {
        return ["<div class='hoverinfo'>", geography.properties.name, "</br> Total revenue: ", dataset.Total, "</div>"].join('');
      },
    }
  });

  // Object.keys(data).forEach(function (a) {
  //   Object.keys(data[a]).forEach(function (k) {
  //       console.log(data[a]);
  //       if (k == "Genres") {
  //           Object.keys(data[a][k]).forEach(function(d){
  //               console.log(data[a][k]);
  //               var dataa = data[a][k]
  //               // console.log(data[a][k][d])
  //           })
  //       }
  //   });
  // });

  var example =  data["EU"]["AUT"]["Genres"];
  console.log(example);

  var genres = [];
  for (const [key, value] of Object.entries(example)) {
      genres.push(value)
  }
  console.log(genres);


  d3v5.select(".container-barchart").append("svg")
                     .attr("width", 600)
                     .attr("height", 400)
                     .attr("id", "barSVG");

    //SVG
    var svg = d3v5.select("#barSVG");
    var h = svg.attr('height');
    var w = svg.attr('width');

    // console.log(dataset);

    // Scale functions
    var xScale = d3v5.scaleLinear()
        .domain([0, 12])
        .range([0, w - 50]);

    var yScale = d3v5.scaleLinear()
        .domain([0, 1500])
        .range([0, h - 50]);

    // Define the axes
    var xAxis = d3v5.axisBottom(xScale);

    // Text label for the x axis
    svg.append("text")
        .attr("transform",
            "translate(" + (w / 2) + " ," +
            (h - 20) + ")")
        .style("text-anchor", "middle")
        .text("Categories");

    var yAxis = d3v5.axisLeft(yScale)
        .tickValues([1500, 1000, 500, 0]);

    // Text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", 0 - (h / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Revenue");

    var bars = svg.selectAll("rect")
        .data(genres)
        .enter()
        .append("rect")
        .attr("class", "bar");

    var ypos = 0;
    bars.attr("x", function (d, i) {
        return (xScale(i) + 40);
    })
        .attr("y", function (e, i) {
            var barheight = yScale(e);
            ypos = h - barheight;
        return ypos - 50;
    })
        .attr("width", 46)
        .attr("fill", "pink")
        .attr("stroke", 'black')
        .attr("height", function (f) {
        return yScale(f)});

    // Draw axes
    svg.append("g").attr("transform", "translate(40, " + (h - 50) + ")").call(xAxis);
    svg.append("g").attr("transform", "translate(40, " + (0) + ")").call(yAxis);

});