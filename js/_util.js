function errorTip(tip, e){
    return {
        error: e,
        tip: tip
    }
}

function extractPropertyFrom(property, objArray){
    return function(value, key){
        return objArray.find(function(obj){
            return obj[key || "name"] === value;
        })[property];
    };
}

function unique(array, property){
    var flags = [], output = [], l = array.length, i;
    for( i=0; i<l; i++) {
        if( flags[array[i][property]]) continue;
        flags[array[i][property]] = true;
        output.push(array[i][property]);
    }
    return output;
}

// taken from: http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
function shadeColor2(color, percent) {
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

function createDiv(elementId){
    var element = document.body.appendChild(document.createElement('div'));
    element.id = elementId;
    return element;
}

function softColors(){
    return [
        '#f1595f', // red
        '#79c36a', // green
        '#599ad3', // blue
        '#f9a65a', // orange
        '#9e66ab',
        '#cd7058',
        '#d77fb3',
        '#727272' // gray
    ];
}