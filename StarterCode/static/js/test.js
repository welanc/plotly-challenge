var jsonPromise = d3.json("../../samples.json");

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
    var firstDatum = data.samples.filter(sample => sample.id === names[0]);
    initBar(firstDatum);

});


// Unpack data for plotting
function unpack(rows, index) {
  return rows.map(function(row) {
    return row[index];
  });
}

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
    var renamedIDs = reversedData.map(i => ({...i, otu_ids: 'OTU ' + i.otu_ids }));
    console.log(renamedIDs);

    return renamedIDs;

};


function initBar(sampleID) {

    var results = topTenSamples(sampleID);
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
        title: 'Colored Bar Chart'
    };

    Plotly.newPlot("bar", data, layout);
    
};


function optionChanged(item) {
    // console.log(item);

    jsonPromise.then((data) => {
        var userValue = item;
        var sample = data.samples.filter(sample => sample.id === userValue);
        barPlot(sample);
    });

    return item;
};


function barPlot(sampleID) {

    var results = topTenSamples(sampleID);

    var x = results.map(object => object.sample_values);
    var y = results.map(object => object.otu_ids);
    var text = results.map(object => object.otu_labels);

    Plotly.restyle("bar", "x", [x]);
    Plotly.restyle("bar", "y", [y]);
    Plotly.restyle("bar", "text", [text]);
    
};

