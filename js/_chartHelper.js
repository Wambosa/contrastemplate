var __chart = null;

function drawChart(chartType, divId, options, dataArray){
    var dataTable = google.visualization.arrayToDataTable(dataArray);
    if(!__chart)
        __chart = new google.visualization[chartType](document.getElementById(divId));

    __chart.draw(dataTable, options);
}

// todo: refactor this. loops are getting crazy
function summarize(json){
    var table = [];

    var categories = json.categories.map(function(c){
        c.relevantMetrics = json.requirements
            .filter(function(req){return req.category === c.name;})
            .map(function(r){return {name: r.name, weight: r.weight||1};})
            .sort(on('name'));
        return c;
    })
    .sort(on('name'));

    // google charts requires a very simple table header. table[0] must be an array of string values ["","",""]
    var categoryList = categories.map(function(c){return c.name;});
    categoryList.unshift("category");
    table.push(categoryList);

    json.solutions.forEach(function(solution){
        var row = [solution.name];

        categories.forEach(function(cat){

            var relevantGrades = cat.relevantMetrics.map(function(metric) {
                return solution.grades[metric.name] && Math.max(Math.min(1, solution.grades[metric.name]), 0) * metric.weight
                    || 0;
            });

            row.push(relevantGrades.reduce(sum)
                * cat.weight
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