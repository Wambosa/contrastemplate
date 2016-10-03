// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(main);

function main() {

    getJson('data/ecm.json')
        .then(function(data){

            document.getElementById("title").innerText = data.problemStatement;

            var allColors = softColors();

            unique(data.requirements, "category").sort().forEach(function(categoryName){

                var element = createDiv(categoryName + "_chart");

                var table = simpleTable(data, categoryName);

                var baseColor = allColors.shift();
                var colors = [];
                for(var i=0; i<table[0].length;i++)
                    colors.push(shadeColor2(baseColor, 0.11*i));

                var options_stacked = {
                    title: categoryName,
                    isStacked: true,
                    height: 300,
                    legend: {position: 'top', maxLines: 3},
                    vAxis: {minValue: 0},
                    colors: colors
                };

                drawChart(
                    'BarChart',
                    element.id,
                    options_stacked,
                    table
                );
            });
        })
        .catch(console.error);
}