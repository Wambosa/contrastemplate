// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(main);

function main() {

    getJson('data/exmapleData.json')
        .then(function (data) {

            document.getElementById("title").innerText = data.problemStatement;

            vis = new ComparisonVisualizer(data).applyBindings();

            vis.chartOptions = {
                title: "High Level",
                isStacked: true,
                height: 340,
                legend: {position: 'top', maxLines: 3},
                vAxis: {minValue: 0},
                colors: softColors()
            };

            vis.draw(
                'BarChart',
                'summary_chart',
                vis.chartOptions,
                summarize(data)
            );

            if(data.categoryWeightSlider){
                vis.categories.forEach(function (c) {

                    var sliderOptions = data.categoryWeightSlider;
                    
                    sliderOptions.initValue = c.weight;
                    sliderOptions.handleColor = c.backgroundColor;
                    sliderOptions.onSlide = function (newVal) {
                        vis.updateWeight(c.name, newVal);
                    };
    
                    var divId = c.name + "_weight_slide";
                    initSlider(divId, sliderOptions);
                });
            }
        })
        .catch(console.error);
}