// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(main);

function main() {

    var softColors = [
        '#f1595f', // red
        '#79c36a', // green
        '#599ad3', // blue
        '#f9a65a', // orange
        '#9e66ab',
        '#cd7058',
        '#d77fb3',
        '#727272' // gray
    ];

    getJson('../data/caseManagement.json')
        .then(function(data){

            document.getElementById("title").innerText = data.problemStatement;

            var primaryDiv = createDiv("summary_chart");

            var options_stacked = {
                title: "High Level",
                isStacked: true,
                height: 340,
                legend: {position: 'top', maxLines: 3},
                vAxis: {minValue: 0},
                colors: softColors
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

function simpleTable(json, category){
    /*
        convert the data from human interpretable to graph consumable
        expecting a problem_solution.json document
        {
            problemStatement: string,
            requirements: [{category: string, name: string, importance: percent}],
            solutions: [{name: string, grades: [...]}]
        }
    */

    var requirements = json.requirements
        .filter(function(req){
            return req.category === category || !category;
        })
        .sort()
        .map(function(req){
            return req.name;
    });

    var table = [requirements.unshift("requirements") && requirements];

    var extract = extractPropertyFrom("importance", json.requirements);

    json.solutions.forEach(function(solution){
        table.push([solution.name].concat(
            solution.grades.filter(function(requirement){
                    return requirement.category === category || !category;
                })
                .sort()
                .map(function(requirement){
                    return Math.min(requirement.grade / extract(requirement.name), 1);
        })));
    });

    return table;
}

function summarizeAll(json){

    var table = [];

    var categories = unique(json.requirements, "category").sort();

    table.push(categories.unshift("category") && categories);

    var extract = extractPropertyFrom("importance", json.requirements);

    json.solutions.forEach(function(solution){
        var row = [solution.name];

        categories.slice(1).forEach(function(cat){

            var relevantGrades = solution.grades
                .filter(function(grade){return grade.category === cat;});

            row.push(relevantGrades
                .map(function(g){return Math.min(g.grade / extract(g.name), 1);})
                .reduce(function(p, c){return p + c;})
                / relevantGrades.length
            );
        });

        table.push(row);
    });

    return table;
}

function drawChart(chartType, divId, options, dataArray){
    var dataTable = google.visualization.arrayToDataTable(dataArray);
    var chart = new google.visualization[chartType](document.getElementById(divId));
    chart.draw(dataTable, options);
}