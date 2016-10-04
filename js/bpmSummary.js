// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(main);

function main() {

    getJson('data/caseManagementRevised.json')
        .then(function (data) {

            vis = new ComparisonVisualizer(data).applyBindings();

            document.getElementById("title").innerText = data.problemStatement;

            vis.chartOptions = {
                title: "High Level",
                isStacked: true,
                height: 340,
                legend: {position: 'top', maxLines: 3},
                vAxis: {minValue: 0},
                colors: softColors()
            };

            vis.draw(vis.chartOptions);

            window.setTimeout(function () {
                vis.categories.forEach(function (c) {

                    var divId = c.name + "_weight_slide";

                    initSlider(divId, c.weight, c.backgroundColor).on("slide", function (newVal) {
                        vis.updateWeight(c.name, newVal)
                    });
                });

            }, 100);
        })
        .catch(console.error);
}

function initSlider(divId, initValue, handleColor){

   var s = new Slider("#"+divId, {
        ticks: [1, 1.25, 1.5, 1.75, 2],
        ticks_positions: [0, 25, 50, 75, 100],
        ticks_labels: ['normal', 'important', 'very important', 'critical', 'very critical'],
        ticks_snap_bounds: 0.1,
        step: 0.01,
        value: initValue || 0
    });

    if(handleColor)
        s.handle1.style.background = handleColor;

    return s
}