// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(main);

function main() {

    getJson('data/caseManagement.json')
        .then(function(data){

            document.getElementById("title").innerText = data.problemStatement;

            var primaryDiv = createDiv("summary_chart");

            var options_stacked = {
                title: "High Level",
                isStacked: true,
                height: 340,
                legend: {position: 'top', maxLines: 3},
                vAxis: {minValue: 0},
                colors: softColors()
            };

            drawChart(
                'BarChart',
                primaryDiv.id,
                options_stacked,
                summarizeAll(data)
            );

        })
        .catch(console.error);

}