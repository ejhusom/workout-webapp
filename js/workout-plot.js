const fileSelector = document.getElementById("file-selector");
fileSelector.addEventListener("change", (event) => {
    const fileList = event.target.files;
    console.log(fileList);
});

var sec = []; 
var hour = []; 
var hr = [];
var lat = [];
var lon = [];
var kph = [];
var alt = [];

document.getElementById('import').onclick = function() {
    var files = document.getElementById('file-selector').files;
    console.log(files);

    var reader = new FileReader();

    reader.onload = function(e) {
        console.log(e);
        var result = JSON.parse(e.target.result);
        var samples = result.RIDE.SAMPLES;
        for (let i = 0; i < samples.length; i++) {
            sec.push(samples[i].SECS);
            hour.push(samples[i].SECS/3600);
            hr.push(samples[i].HR);
            lat.push(samples[i].LAT);
            lon.push(samples[i].LON);
            kph.push(samples[i].KPH);
            alt.push(samples[i].ALT);
        }

        function makeTrace(yData, name, yAxis) {
            var trace = {
                x: hour,
                y: yData,
                name: name,
                type: 'scatter',
                yaxis: yAxis
            };
            return trace;
        }

        var hrTrace = makeTrace(hr, "hr", "y");
        var kphTrace = makeTrace(kph, "kph", "y2");
        var altTrace = makeTrace(alt, "alt", "y3");

        var data = [hrTrace, kphTrace, altTrace];
        var layout = {
            title: 'Workout data',
            yaxis: {title: 'bpm'},
            yaxis2: {
                title: 'kph',
                anchor: 'free',
                titlefont: {color: '#ff7f0e'},
                tickfont: {color: '#ff7f0e'},
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

        var formatted = JSON.stringify(result, null, 2);
        document.getElementById('result').value = formatted;
    }
    reader.readAsText(files.item(0));
}
