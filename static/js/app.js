function buildMetadata(sample) {
  var url = `/metadata/${sample}`;
  // Find the url for 
  d3.json(url).then(function(response) {
    // select the panel with id of `#sample-metadata`
    var metadata_panel = d3.select("#sample-metadata");
    // clear existing metadata cache
    metadata_panel.html("");
    
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(response).forEach(function([key, value]) {      
      // append one table row `tr` for each key,value pair 
      var row = metadata_panel.append("tr");
      
      // create collumns
      var cell = row.append("td");
      
      // fill in each cell with text
      cell.text(`${key}: ${value}`);

      // Build the Gauge Chart
      if(key === "WFREQ") {
        // Pass the wash frequency value into the build gauege function
        buildGauge(value);
      }
    });
  });
}

function buildCharts(sample) {

  // Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;
  d3.json(url).then(function(response) {

    // Pick the top 10 values to use for the traces
    var topSamples = response.sample_values.slice(0,10);
    var topIds = response.otu_ids.slice(0,10);
    var sampleLabels = response.otu_labels.slice(0,10);

    // Create the pie and bubble traces
    var pieTrace = {
      values: topIds,
      labels: topSamples,
      type: 'pie',
      hoverinfo: sampleLabels
    };  
    var bubbleTrace = {
      x: topIds,
      y: topSamples,
      mode: 'markers',
      text: sampleLabels,
      marker: {
        size: topSamples,
        color: topIds,
      }
    };

    // Store the traces in an array which can be passed into Plotly.newPlot()
    pieData = [pieTrace];
    bubbleData = [bubbleTrace];

    // var layout = {
    //   height: 400,
    //   width: 600
    // };

    // Create new plots
    Plotly.newPlot("pie", pieData);
    Plotly.newPlot("bubble", bubbleData);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
