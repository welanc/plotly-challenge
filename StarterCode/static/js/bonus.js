var jsonPromise = d3.json("./data/samples.json");

// Get the current value of the dropdown menu
jsonPromise.then((data) => {
    // Get dropdown
    var dropdown = d3.select("#selDataset");
    var names = data.names;

    // Fill in gauge chart with initial data
    var firstMetaData = data.metadata.filter(metadata => metadata.id === parseInt(names[0]));
    gaugeChart(firstMetaData);


});

// Gauge chart function
function gaugeChart(sampleID) {
    var data = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: sampleID[0].wfreq,
            title: { text: `Belly Button Washing Frequency<br>Scrubs per Week` },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [null, 9] },
                steps: [
                    { range: [null, 1], color: "#99ffbb" },
                    { range: [1, 2], color: "#88feaa" },
                    { range: [2, 3], color: "#77ed99" },
                    { range: [3, 4], color: "#66dc88" },
                    { range: [4, 5], color: "#55cb77" },
                    { range: [5, 6], color: "#44ba66" },
                    { range: [6, 7], color: "#33a955" },
                    { range: [7, 8], color: "#229844" },
                    { range: [8, 9], color: "#118733" }
                ],
                bar: { color: "orange" }
            }
        }
    ];

    var layout = { width: 600, height: 400 };

    Plotly.newPlot('gauge', data, layout);

};
