function ComparisonVisualizer(json) {

    this.problemStatement = json.problemStatement || "missing problem statement";
    this.categories = json.categories || ["missing 'categories' in datafile"];
    this.gradeKey = json.gradeKey || [{name: "fail", min:0, max:0}, {name: "pass", min:1, max:1}];
    this.solutions = json.solutions;

    this.requirements = json.requirements.sort(on('category'));
}

ComparisonVisualizer.prototype = {
    applyBindings: function(){
        ko.applyBindings(this);
    }
};

ComparisonVisualizer.prototype.constructor = ComparisonVisualizer;