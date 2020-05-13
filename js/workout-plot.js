const fileSelector = document.getElementById("file-selector");
fileSelector.addEventListener("change", (event) => {
    const fileList = event.target.files;
    console.log(fileList);
});

var sec = []; 
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
            hr.push(samples[i].HR);
            lat.push(samples[i].LAT);
            lon.push(samples[i].LON);
            kph.push(samples[i].KPH);
            alt.push(samples[i].ALT);
        }

        var hrTrace = {
            x: sec,
            y: hr,
            type: 'scatter'
        };

        var data = [hrTrace];
        Plotly.newPlot('mainPlot', data);

        var formatted = JSON.stringify(result, null, 2);
        document.getElementById('result').value = formatted;
    }
    reader.readAsText(files.item(0));
}

