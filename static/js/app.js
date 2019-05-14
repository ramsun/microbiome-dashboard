function buildMetadata(sample) {
  
  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  var url = `/metadata/${sample}`;
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;
  d3.json(url).then(function(response) {
  
    var topSamples = response.sample_values.slice(0,10);
    var topIds = response.otu_ids.slice(0,10);
    //var sampleLabels = response.otu_labels;
    console.log(topSamples);
    //console.log(sampleIds);
    
    
    var pieTrace = {
      x: response.otu_ids,
      y: response.sample_values,
      type: 'pie'
    };

    var bubbleTrace = {
      x: response.otu_ids,
      y: [10, 11, 12, 13],
      mode: 'markers',
      marker: {
        size: [40, 60, 80, 100]
      }
    };
    
    // var trace = {
    //   type: "scatter",
    //   mode: "lines",
    //   name: "Bigfoot Sightings",
    //   x: response.map(data => data.year),
    //   y: response.map(data => data.sightings),
    //   line: {
    //     color: "#17BECF"
    //   }
    // };

    // var data = [trace];

    // var layout = {
    //   title: "Bigfoot Sightings Per Year",
    //   xaxis: {
    //     type: "date"
    //   },
    //   yaxis: {
    //     autorange: true,
    //     type: "linear"
    //   }
    // };

    // Plotly.newPlot("plot", data, layout);
  });
    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
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
