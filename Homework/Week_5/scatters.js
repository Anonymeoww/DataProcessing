window.onload = function() {

    var teensInViolentArea = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB11/all?startTime=2010&endTime=2017";
    var teenPregnancies = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB46/all?startTime=1960&endTime=2017";
    var GDP = "https://stats.oecd.org/SDMX-JSON/data/SNA_TABLE1/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EU28+EU15+OECDE+OECD+OTF+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+ROU+RUS+SAU+ZAF+FRME+DEW.B1_GE.HCPC/all?startTime=2012&endTime=2018&dimensionAtObservation=allDimensions";

    var dataset;

    var requests = [d3.json(teensInViolentArea), d3.json(teenPregnancies), d3.json(GDP)];

    Promise.all(requests).then(function (response) {
        dataset = load_data(response);
        drawPlot(dataset, "2012")
    }).catch(function (e) {
        throw(e);
    });

    document.getElementById('submityear').onclick = function () {
        var svgR = d3.select("svg");
        svgR.selectAll("*").remove();
        drawPlot(dataset, document.getElementById('y-value').value)
    }
};

function load_data(response){

    //Load Data

    var teenVA = transformResponseT(response[0]);
    var teenPreg = transformResponseT(response[1]);
    var GDPs = transformResponseGDP(response[2]);

    var dataset = {2012:[], 2013:[], 2014:[], 2015:[]};
    
    Object.keys(teenVA).forEach(function(k){
      teenVA[k].forEach(function(tvk){
          if (dataset[tvk.Time]){
              if(!(tvk.Country == 'OECD - Average')){
                  dataset[tvk.Time].push({
                      "Country": tvk.Country,
                      "teenVio": tvk.Datapoint
                  })
              }
          }
      })
    });

    Object.keys(teenPreg).forEach(function(k){
      teenPreg[k].forEach(function(tvk){
          if (dataset[tvk.Time]){
              dataset[tvk.Time].forEach(function(as){
                  if (as.Country == tvk.Country){
                      as["teenPreg"] = tvk.Datapoint
                  }
              })
          }
      })
    });

    Object.keys(GDPs).forEach(function(k){
      GDPs[k].forEach(function(tvk){
          if (dataset[tvk.Year]){
              dataset[tvk.Year].forEach(function(as){
                  if (as.Country == tvk.Country){
                      as["GDP"] = tvk.Datapoint
                  }
              })
          }
      })
    });

    return dataset
}

function drawPlot(dataset, t) {

    var margin = {top: 20, right: 50, bottom: 100, left: 100},
    w = 1200 - margin.left - margin.right,
    h = 500 - margin.top - margin.bottom;

    // Setup axes
    var xScale = d3.scaleLinear()
        .domain([0, 100000])
        .range([0, w]);

    var yScale = d3.scaleLinear()
        .domain([0, 35])
        .range([h, 0]);

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    // add the graph canvas to the body of the webpage
    var svg = d3.select("body").select("svg")
                               .attr("width", w + margin.left + margin.right)
                               .attr("height", h + margin.top + margin.bottom)
                               .append("g")
                               .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // add the tooltip area to the webpage
	var tooltip = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);

    // x-axis
    svg.append("g").attr("class", "x axis")
                   .attr("transform", "translate(0," + h + ")")
                   .call(xAxis)
                   .append("text")
                   .attr("class", "label")
                   .attr("x", w)
                   .attr("y", -6)
                   .style("text-anchor", "end")
                   .text('GDP');

    // y-axis
    svg.append("g").attr("class", "y axis")
                   .call(yAxis)
                   .append("text")
                   .attr("class", "label")
                   .attr("transform", "rotate(-90)")
                   .attr("y", 6)
                   .attr("dy", ".71em")
                   .style("text-anchor", "end")
                   .text('teenViolence');

    // labels

    svg.append("text").attr("x", (w/2))
                    .attr("y", (20))
                    .attr("text-anchor", "middle")
                    .attr("font-weight", "bold")
                    .style("font-size", "16px")
                    .style("font-family", "Arial")
                    .text("Teens living in violent areas vs. GDP");

    svg.append("text").attr("x", (w/2))
                    .attr("y", (h + 50))
                    .attr("text-anchor", "middle")
                    .style("font-size", "12px")
                    .style("font-family", "Arial")
                    .text("GDP");

    svg.append("text").attr("x", (w-145))
                    .attr("y", 30)
                    .attr("text-anchor", "middle")
                    .style("font-size", "14px")
                    .style("font-family", "Arial")
                    .text("Legend");

    svg.append("text").attr("x", -200)
                    .attr("y", -50)
                    .attr("text-anchor", "middle")
                    .attr('transform', 'rotate(-90)')
                    .style("font-size", "12px")
                    .style("font-family", "Arial")
                    .text("Children (0-17) living in areas with problems with crime or violence (%)");

    // draw dots
    svg.selectAll(".dot").data(dataset[t])
                        .enter().append("circle")
                          .attr("class", "dot")
                          .attr("r", 7)
                          .attr("cx", d => xScale(d["GDP"]))
                          .attr("cy", e => yScale(e["teenVio"]))
                          .style("fill",  function(f){
                                if (f["teenPreg"] > 2.0 && f["teenPreg"] < 16.4){ return "#fde0dd"}
                                if (f["teenPreg"]> 16.4 && f["teenPreg"] < 29.5){ return "#fa9fb5"}
                                if (f["teenPreg"] > 29.5){ return "#c51b8a" }
         })
                          .on("mouseover", function(d) {
                              tooltip.transition()
                                   .duration(200)
                                   .style("opacity", .9);
                              tooltip.html("Country: " + d["Country"] + "<br> Teen Pregnancy Rate: " + d["teenPreg"])
                                   .style("left", (d3.event.pageX + 10) + "px")
                                   .style("top", (d3.event.pageY - 28) + "px");
                          })
                          .on("mouseout", function(d) {
                              tooltip.transition()
                                   .duration(500)
                                   .style("opacity", 0);
                          });

    var max = getMax(dataset["2012"], "teenPreg");
    console.log(max);

    var min = getMin(dataset["2012"], "teenPreg");
    console.log(min);

    var firstValue = ((max-min)/3+min).toFixed(1);
    var secondValue = ((max-min)/3*2+min).toFixed(1);

    var firstLegendText = min.toString() + " - " + firstValue.toString();
    var secondLegendText = firstValue.toString() + " - " + secondValue.toString();
    var thirdLegendText = secondValue.toString() + " - " + max.toString();

    var g = svg.append('g');
    g.append("circle").attr("cx",w-160).attr("cy",40).attr("r", 6).style("fill", "#fde0dd");
    g.append("text").attr("x", w-140).attr("y", 45).text(firstLegendText).style("font-size", "15px").style("font-family", "Arial").attr("alignment-baseline","middle");

    g = svg.append('g');
    g.append("circle").attr("cx",w-160).attr("cy",60).attr("r", 6).style("fill", "#fa9fb5");
    g.append("text").attr("x", w-140).attr("y", 65).text(secondLegendText).style("font-size", "15px").style("font-family", "Arial").attr("alignment-baseline","middle");

    g = svg.append('g');
    g.append("circle").attr("cx",w-160).attr("cy",80).attr("r", 6).style("fill", "#c51b8a");
    g.append("text").attr("x", w-140).attr("y", 85).text(thirdLegendText).style("font-size", "15px").style("font-family", "Arial").attr("alignment-baseline","middle");



    // Tooltip
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([50, 0])
        .html(function (d) {
            return "<strong>Country:</strong><span>" + d['Country'] + "</span>"
        });
    svg.call(tip);
}

function getMax(arr, prop) {
    var max;
    for (var i=0 ; i<arr.length ; i++) {
        if (!max || parseInt(arr[i][prop]) > parseInt(max[prop]))
            max = arr[i];
    }
    return max.teenPreg;
}

function getMin(arr, prop) {
    var max;
    for (var i=0 ; i<arr.length ; i++) {
        if (!max || parseInt(arr[i][prop]) < parseInt(max[prop]))
            max = arr[i];
    }
    return max.teenPreg;
}

