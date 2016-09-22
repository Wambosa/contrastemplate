function drawChart(chartType, divId, options, dataArray){
    var dataTable = google.visualization.arrayToDataTable(dataArray);
    var chart = new google.visualization[chartType](document.getElementById(divId));
    chart.draw(dataTable, options);
}

function summarize(json){

    var table = [];

    var categories = json.categories && json.categories.map(function(c){return c.name;}).sort()
        || unique(json.requirements, "category").sort();

    table.push(categories.unshift("category") && categories);

    var extract = extractPropertyFrom("importance", json.requirements);

    json.solutions.forEach(function(solution){
        var row = [solution.name];

        categories.slice(1).forEach(function(cat){

            // todo: move out of loop
            var relevantMetric = json.requirements
                .filter(function(req){return req.category === cat;})
                .map(function(r){return r.name;})
                .sort();

            var relevantGrades = relevantMetric.map(function(metricName) {
                if (solution.grades[metricName]) {
                    return Math.min(1, solution.grades[metricName] / (extract(metricName) || 1));
                } else{
                    return 0;
                }
            });

            row.push(relevantGrades.reduce(function(p, c){return p + c;})
                / relevantGrades.length
            );
        });

        table.push(row);
    });

    return table;
}

//old method
function summarizeAll(json){

    var table = [];

    var categories = json.categories && json.categories.map(function(c){return c.name;}).sort()
        || unique(json.requirements, "category").sort();

    table.push(categories.unshift("category") && categories);

    var extract = extractPropertyFrom("importance", json.requirements);

    json.solutions.forEach(function(solution){
        var row = [solution.name];

        categories.slice(1).forEach(function(cat){

            var relevantGrades = solution.grades
                .filter(function(grade){return grade.category === cat;})
                .sort(function(a, b){
                    if(a.name < b.name)
                        return -1;
                    if(a.name > b.name)
                        return 1;

                    return 0;
                });

            row.push(relevantGrades
                    .map(function(g){return Math.min(g.grade / (extract(g.name)||1), 1);})
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