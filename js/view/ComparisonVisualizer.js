function ComparisonVisualizer(json) {

    this.inputData = json;

    this.problemStatement = json.problemStatement || "missing problem statement";
    this.categories = json.categories || ["missing 'categories' in datafile"];
    this.gradeKey = json.gradeKey || [{name: "fail", min:0, max:0}, {name: "pass", min:1, max:1}];
    this.solutions = json.solutions;

    var allColors = softColors();
    var categoryColor = {};

    json.categories.sort(on('name')).forEach(function(cat){
        categoryColor[cat.name] = allColors.shift();
    });

    var textCol = textColors(true);

    this.requirements = json.requirements.sort(on('category'))
        .map(function(req){

            req.categoryColor = categoryColor[req.category];
            req.headerColor = shadeColor2(req.categoryColor, .5);
            req.bodyColor = shadeColor2(req.categoryColor, .6);
            req.textColor = textCol[req.categoryColor];

            req.leaderBoard = json.solutions.filter(function(sol){
                return sol.grades[req.name] > 0.99 &&
                    sol.name != "Perfect Solution";
            })
            .map(function(sol) {
                    return {
                        name: sol.name,
                        grade: sol[req.category]
                    };
            })
            .sort(on('grade', true));

            return req;
    });

    this.updateWeight = function(category, newVal){
        this.categories.find(function(c){
            return c.name == category;
        }).weight = newVal;


        this.draw(this.chartOptions, {
            categories: this.categories,
            requirements: this.inputData.requirements,
            solutions: this.inputData.solutions
        });
    };
}


ComparisonVisualizer.prototype = {
    applyBindings: function(){
        ko.applyBindings(this);
        return this;
    },

    draw: function(options, newData) {
        drawChart(
            'BarChart',
            "summary_chart",
            options,
            summarize(newData || this.inputData)
        );
    }
};

ComparisonVisualizer.prototype.constructor = ComparisonVisualizer;