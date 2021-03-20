var jsonPromise = d3.json("./../../data/samples.json");

// Get the current value of the dropdown menu
jsonPromise.then((data) => {
    // Get dropdown
    var dropdown = d3.select("#selDataset");
    var names = data.names;

    // Fill dropdown with name IDs
    names.forEach((item) => {
        dropdown.append("option")
            .attr("value", item)
            .text(item);
    });

    // Fill in Demographic Info panel with initial data
    var firstMetaData = data.metadata.filter(metadata => metadata.id === parseInt(names[0]));
    demoInfo(firstMetaData);

    // Generate initial horizontal bar graph and bubble chart
    var firstDatum = data.samples.filter(sample => sample.id === names[0]);
    initBar(firstDatum);
    initBubble(firstDatum);
});



// Get top ten samples for bar plots
function topTenSamples(data) {
    // Assign empty array to hold reorganised data    
    var arr = [];

    // Reorganise data to suit sorting and slicing
    for (var i = 0; i < Object.values(data[0].sample_values).length; i++) {
        var obj = {};
        obj["sample_values"] = data[0].sample_values[i];
        obj["otu_ids"] = data[0].otu_ids[i];
        obj["otu_labels"] = data[0].otu_labels[i];
        arr.push(obj);
    };

    // Sort the data by sample values
    var sortedBySamples = arr.sort((a, b) => b.sample_values - a.sample_values);

    // Slice the first 10 objects for plotting
    var slicedData = sortedBySamples.slice(0, 10);

    // Reverse the array to accommodate Plotly's defaults
    var reversedData = slicedData.reverse();

    // Add "OTU" prefix to the IDs
    var renamedIDs = reversedData.map(i => ({ ...i, otu_ids: 'OTU ' + i.otu_ids }));
    console.log(renamedIDs);

    return renamedIDs;
};

// Create initial bar plot 
function initBar(sampleID) {

    // Fetch top ten samples using function
    var results = topTenSamples(sampleID);

    // Log to confirm results have been successfully fetched
    console.log(results.map(object => object.sample_values));

    // Define the data and layout to create a Plotly bar plot 
    var trace1 = {
        x: results.map(object => object.sample_values),
        y: results.map(object => object.otu_ids),
        text: results.map(object => object.otu_labels),
        type: 'bar',
        orientation: 'h',
        marker: {
            color: 'rgba(35,188,132,0.6)',
            width: 10
        }
    };

    var data = [trace1];

    var layout = {
        title: `Top 10 OTUs in Test Subject`
    };

    // Generate bar plot
    Plotly.newPlot("bar", data, layout);
};


// Create initial bubble chart 
function initBubble(sampleID) {

    // Define variables for x and y axes and labels
    var otuIDs = sampleID.flatMap(object => object.otu_ids);
    var sampleValues = sampleID.flatMap(object => object.sample_values);
    var otuLabels = sampleID.flatMap(object => object.otu_labels);

    // Log to confirm successfully defined variables
    console.log(otuIDs);
    console.log(sampleValues);
    console.log(otuLabels);

    // Define the data and layout to create a Plotly bar plot 
    var trace1 = {
        x: otuIDs,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
            color: otuIDs,
            size: sampleValues
        }
    };

    var data = [trace1];

    var layout = {
        title: 'Amount and ID of OTUs in Test Subject',
        showlegend: false,
        xaxis: {
            title: {
                text: 'OTU ID'
            },
        }
    };

    // Generate bubble chart
    Plotly.newPlot("bubble", data, layout);
};

// Populate Demographic Info into panel
function demoInfo(sampleID) {
    var panelBody = d3.select("#sample-metadata");

    // clear any existing data
    panelBody.html("");

    sampleID.forEach((id) => {
        Object.entries(id).forEach(([key, value]) => {
            panelBody.append("p").text(`${key}: ${value}`);
        });

    });

};

// Change all visualisations per to current selection sample ID
function optionChanged(item) {
    // Log to confirm ID matches selection dropdown
    console.log(item);

    // Update bar plot, bubble chart and demographic
    // info panel with current selection sample ID
    jsonPromise.then((data) => {
        var userValue = item;

        var sample = data.samples.filter(sample => sample.id === userValue);
        barPlot(sample);
        bubblePlot(sample);

        var newMetaData = data.metadata.filter(metadata => metadata.id === parseInt(userValue));
        demoInfo(newMetaData);
        gaugeChart(newMetaData);
    });

    return item;
};

// Update initial bar plot with current dropdown option selection
function barPlot(sampleID) {

    // Get top ten of current selected sample ID
    var results = topTenSamples(sampleID);

    // Map the new data to update the existing bar plot
    var x = results.map(object => object.sample_values);
    var y = results.map(object => object.otu_ids);
    var text = results.map(object => object.otu_labels);

    // Restyle the existing plot with current selected sample ID data
    Plotly.restyle("bar", "x", [x]);
    Plotly.restyle("bar", "y", [y]);
    Plotly.restyle("bar", "text", [text]);
};


// Update initial bubble chart with current dropdown option selection
function bubblePlot(sampleID) {

    // Map the new data to update the existing bubble chart
    var x = sampleID.flatMap(object => object.otu_ids);
    var y = sampleID.flatMap(object => object.sample_values);
    var text = sampleID.flatMap(object => object.otu_labels);

    // Restyle the existing bubble chart with current selected sample ID data
    Plotly.restyle("bubble", "x", [x]);
    Plotly.restyle("bubble", "y", [y]);
    Plotly.restyle("bubble", "text", [text]);
};
