function drawChart(chartType, divId, options, dataArray){
    var dataTable = google.visualization.arrayToDataTable(dataArray);
    var chart = new google.visualization[chartType](document.getElementById(divId));
    chart.draw(dataTable, options);
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