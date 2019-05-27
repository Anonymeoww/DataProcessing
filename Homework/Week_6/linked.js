d3v5.json("data.json").then(function(data){
  // console.log(data["EU"]["Genres"]);
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

  var onlyValues = [];

  Object.keys(data).forEach(function (a) {
    onlyValues.push(data[a]["Total"]);
    return (data[a]["Total"])
  });

  // colors should be uniq for every value.
  // For this purpose we create palette(using min/max series-value)
  var minValue = Math.min.apply(null, onlyValues),
        maxValue = Math.max.apply(null, onlyValues);

  // create color palette function
  // color can be whatever you wish
  var paletteScale = d3v5.scaleLinear()
      .domain([minValue,maxValue])
      .range(["#000000","#02386F"]); // blue color

  var dataset = {};

  Object.keys(data).forEach(function (a) {
    Object.keys(data[a]).forEach(function (k) {
      dataset[k] = {
      Total: data[a][k].Total,
      Genres: data[a][k].Genres,
      fillColor: paletteScale(data[a][k].Total)

    };
    console.log(data[a][k])
    })
  });

  console.log(dataset);

  var map = new Datamap({
    element: document.getElementById('container'),
    fills: {
    defaultFill: 'pink'
    },
    // data: dataset,
    geographyConfig: {
      highlightBorderWidth: 3,
      popupTemplate: function(geography, dataset) {
        return '<div class="hoverinfo">' + geography.properties.name + "<br> Total revenue: " + dataset.Total
      },
    }
  });

  d3v5.select(".container-barchart").append("svg")
                     .attr("width", 600)
                     .attr("height", 400)
                     .attr("id", "barSVG");
  d3v5.select(".footer-barchart")
                   .append("p")
                   .text("This bar chart is made by Dilisha C. Jethoe (12523186)")
                   .style("font-family", "Courier");

  d3v5.json("top2018.json").then(function (data) {

      //SVG
      var svg = d3.select("#barSVG");
      var h = svg.attr('height');
      var w = svg.attr('width');
  })
});