// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(main);

function main() {

    var verticalScaleData = [
        ['Years', 'Capacity', 'Demand']
    ];

    var baseLine = 18000;
    var dailyGrowth = 2;

    var daysToProject = 1095;
    for(var i=1; i<=daysToProject;i++){
        verticalScaleData.push([
            "day " + i,
            predictCapacity(baseLine + getDemand(i, dailyGrowth)),
            baseLine + getDemand(i, dailyGrowth)
        ]);
    }

    var primaryDiv = createDiv("summary_chart");

    var options = {
        title: "500 Million Files @40k growth per day",
        height: 340,
        legend: {position: 'top', maxLines: 3},
        vAxis: {title: "Storage GB", minValue: 0},
       // colors: softColors()
    };

    drawChart(
        'LineChart',
        primaryDiv.id,
        options,
        verticalScaleData
    );
}

function predictCapacity(demand){
    return verticalScale(demand*1.1, 10);
}

function verticalScale(need, minimumHop){
    return Math.ceil(need/minimumHop) * minimumHop;
}

function getDemand(day, dailyGrowth){
    return day*dailyGrowth;
}