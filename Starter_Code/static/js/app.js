// // Build the metadata panel
function buildMetadata(sample) {

  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
      
    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let result = metadata.find(meta => meta.id == sample);
      

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");


    // Use `.html("") to clear any existing metadata
    panel.html("");

    if(result){
      Object.entries(result).forEach(([key, value]) => {
        panel.append('h6').text(`${key.toUpperCase()}: ${value}`)
      });
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;


    // Filter the samples for the object with the desired sample number
    let sampleResult = samples.find(samp => samp.id == sample);

    if(sampleResult){

      // Get the otu_ids, otu_labels, and sample_values
      let otu_ids = sampleResult.otu_ids;
      let otu_labels = sampleResult.otu_labels
      let sample_values = sampleResult.sample_values;
  
  
      // Build a Bubble Chart
      // Create a layout for the Bubblechart
      let bubbleLayout = {
          title: "Bacteria Cultures Per Sample",
          margin: {t:0}, 
          showlegend: false, 
          xaxis: {title: "OTU ID"},
          yaxis: {title: "Number of Bacteria"},
          hovermode: "Electric",
          margin: {t:50}
      };
  
      // Build a Bubble Chart
      let bubbleMetrics = [{
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
          }
      }]; 
  
      // Render the Bubble Chart
      Plotly.newPlot("bubble", bubbleMetrics, bubbleLayout, {responsive: true});
  
  
      // For the Bar Chart, map the otu_ids to a list of strings for your yticks
      let yticks = otu_ids.slice(0,10).map(id => 'OTU ' + id).reverse();
  
  
      // Build a Bar Chart
      // Don't forget to slice and reverse the input data appropriately
      let barMetrics = [{
          x: sample_values.slice(0,10).reverse(),
          y: yticks,
          text: otu_labels.slice(0,10).reverse(),
          type: "bar",
          orientation: 'h'
      }];
      //Create the layout for the bar
      let barLayout = {
          title: "Top 10 Bacteria Cultures Found",
          margin: {t: 30, l: 150},
          xaxis: {
          tickmode: "linear",
          dtick: 20,
          title: "Number of Bacteria"
          },
          yaxis: {
          tickmode: "array",
          tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          ticktext: yticks
          }
      };
  
      // Render the Bar Chart
      Plotly.newPlot("bar", barMetrics, barLayout);

    } 

  });
}

//   // Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;
    console.log(names);

      
    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select('#selDataset');

  
    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.

    for (let i = 0; i < names.length; i++){
      let name = names[i];
      dropdown.append("option").text(name);
    }
    // Get the first sample from the list
    let default_sample = names[0];
    
    

    // Build charts and metadata panel with the first sample
    buildCharts(default_sample);
    buildMetadata(default_sample);

  });
}

//   // Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);

}

//   // Initialize the dashboard
init();