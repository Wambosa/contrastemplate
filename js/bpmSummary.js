// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(main);

function main() {

    getJson('data/caseManagementRevised.json')
        .then(function(data){

            var vis = new ComparisonVisualizer(data).applyBindings();

            document.getElementById("title").innerText = data.problemStatement;

            var options_stacked = {
                title: "High Level",
                isStacked: true,
                height: 340,
                legend: {position: 'top', maxLines: 3},
                vAxis: {minValue: 0},
                colors: softColors()
            };

            vis.draw(options_stacked);

        })
        .catch(console.error);

}