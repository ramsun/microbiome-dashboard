function buildMetadata(sample) {
  
  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  var url = `/metadata/${sample}`;
  d3.json(url).then(function(response) {
    
    // Use d3 to select the panel with id of `#sample-metadata`
    var metadata_panel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    metadata_panel.html("");
    
    console.log(typeof response, response);
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(response).forEach(function([key, value]) {      
      // Use d3 to append one table row `tr` for each ufo_sighting object 
      var row = metadata_panel.append("tr");
      
      // Use d3 to append 1 cell per ufo_sigthing value (create collumns)
      var cell = row.append("td");
      
      // Use d3 to fill in each cell with ufo_sighting values (text)
      cell.text(`${key}: ${value}`);

      // BONUS: Build the Gauge Chart
      // buildGauge(data.WFREQ);
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
