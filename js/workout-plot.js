var L = L || require('leaflet');

const fileSelector = document.getElementById("file-selector");
fileSelector.addEventListener("change", (event) => {
    const fileList = event.target.files;
    console.log(fileList);
});


document.getElementById('import').onclick = function () {
    var files = document.getElementById('file-selector').files;
    console.log(files);

    var reader = new FileReader();

    reader.onload = function (e) {
        var result = JSON.parse(e.target.result);
        var samples = result.RIDE.SAMPLES;

        var sec = [];
        var hour = [];
        var hr = [];
        var latlon = [];
        var kph = [];
        var alt = [];

        for (let i = 0; i < samples.length; i++) {
            sec.push(samples[i].SECS);
            hour.push(samples[i].SECS / 3600);
            hr.push(samples[i].HR);
            latlon.push([samples[i].LAT, samples[i].LON]);
            kph.push(samples[i].KPH);
            alt.push(samples[i].ALT);
        }

        function makeTrace(yData, name, yAxis = null) {
            var trace = {
                x: hour,
                y: yData,
                name: name,
                type: 'scatter',
            };
            if (yAxis != null) {
                trace.yaxis = yAxis;
            }
            return trace;
        }

        var hrTrace = makeTrace(hr, "hr", "y");
        var kphTrace = makeTrace(kph, "kph", "y2");
        var altTrace = makeTrace(alt, "alt", "y3");

        var data = [hrTrace, kphTrace, altTrace];
        var layout = {
            title: 'Workout data',
            yaxis: { title: 'bpm' },
            yaxis2: {
                title: 'kph',
                anchor: 'free',
                titlefont: { color: '#ff7f0e' },
                tickfont: { color: '#ff7f0e' },
                side: 'left',
                position: -1.02,
                overlaying: 'y'
            },
            yaxis3: {
                title: 'm',
                anchor: 'x',
                side: 'right',
                overlaying: 'y'
            }
        }
        Plotly.newPlot('mainPlot', data, layout);

        var map = L.map('map').setView(latlon[0], 12);
        L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            maxZoom: 17,
            attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        }).addTo(map);

        var polyline = L.polyline(latlon, { color: 'red' }).addTo(map);

    }
    // reader.readAsText(files.item(0));
    console.log(files.length);
    for (let i = 0; i < files.length; i++) {
        // const element = files.item(i);
        reader.readAsText(files.item(i));

    }
}
