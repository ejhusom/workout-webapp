var L = L || require('leaflet');

const fileSelector = document.getElementById("file-selector");
fileSelector.addEventListener("change", (event) => {
    const fileList = event.target.files;
    console.log(fileList);
});

var map = L.map('map').setView([41.9, 12.5], 12);
L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
}).addTo(map);

var colors = ["red", "blue", "green", "yellow", "brown", "black", "white", "purple"];

function extractData(samples) {

    var data = new Object();
    data.sec = [];
    data.hour = [];
    data.hr = [];
    data.latlon = [];
    data.kph = [];
    data.alt = [];

    for (let i = 0; i < samples.length; i++) {
        data.sec.push(samples[i].SECS);
        data.hour.push(samples[i].SECS / 3600);
        data.hr.push(samples[i].HR);
        data.latlon.push([samples[i].LAT, samples[i].LON]);
        data.kph.push(samples[i].KPH);
        data.alt.push(samples[i].ALT);
    }

    return data;
}

function makeTrace(xData, yData, name, yAxis = null) {

    var trace = {
        x: xData,
        y: yData,
        name: name,
        type: 'scatter',
    };
    if (yAxis != null) {
        trace.yaxis = yAxis;
    }
    return trace;
}

function plotData(data, divId) {

    var hrTrace = makeTrace(data.hour, data.hr, "hr", "y");
    var kphTrace = makeTrace(data.hour, data.kph, "kph", "y2");
    var altTrace = makeTrace(data.hour, data.alt, "alt", "y3");

    var data = [hrTrace, kphTrace, altTrace];
    var layout = {
        title: 'Workout data',
        // yaxis: { title: 'bpm' },
        yaxis2: {
            // title: 'kph',
            anchor: 'free',
            titlefont: { color: '#ff7f0e' },
            tickfont: { color: '#ff7f0e' },
            side: 'left',
            position: 0.02,
            overlaying: 'y'
        },
        yaxis3: {
            // title: 'm',
            anchor: 'x',
            side: 'right',
            overlaying: 'y'
        }
    }
    Plotly.newPlot(divId, data, layout);
}

function plotPath(latlon) {

    map.panTo(latlon[0]);
    var polyline = L.polyline(latlon, { color: colors.pop() }).addTo(map);

}

document.getElementById('import').onclick = function () {
    var files = document.getElementById('file-selector').files;
    console.log(files);

    var pathList = [];

    for (let i = 0; i < files.length; i++) {
        var reader = new FileReader();

        // var div = document.createElement("div");
        // div.id = "plot" + i.toString();
        // document.getElementById("dataPlots").appendChild(div);

        reader.onload = function (e) {
            var result = JSON.parse(e.target.result);
            var samples = result.RIDE.SAMPLES;
            var data = extractData(samples);

            plotData(data, "plot");
            plotPath(data.latlon);

        }
        reader.readAsText(files.item(i));
    }

    // plotMap(pathList);


    // console.log(files.length);
    // for (let i = 0; i < files.length; i++) {
    //     // const element = files.item(i);
    //     reader.readAsText(files.item(i));

}
