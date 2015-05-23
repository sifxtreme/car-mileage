Date.prototype.dayOfYear= function(){
	var j1= new Date(this);
	j1.setMonth(0, 0);
	return Math.round((this-j1)/8.64e7);
};

// convert date (01/28/1997) to number 1997.076
var convertDateToNumber = function(date){
	var d = new Date(date);
	var dateNumber = d.getFullYear();
	dateNumber += d.dayOfYear() / 365;
	return dateNumber;
};

var convertAllYearsInData = function(data){
	for(var i=0; i < data.length; i++){
		data[i][0] = convertDateToNumber(data[i][0]);
	}

	return data;
};

var useRegressionEquation = function(regressionResult, time){
	return Math.round(regressionResult.equation[0] * time + regressionResult.equation[1]);
};

var getEarliestOrLatestIndex = function(data, isEarliest){
	var index = 0;
	for(var i=0; i < data.length; i++){
		if(isEarliest){
			if(data[i] < data[index]){
				index = i;
			}			
		}
		else{
			if(data[i] > data[index]){
				index = i;
			}
		}
	}

	return index;
};

var abqData = [["01/28/1997", 72], ["02/01/1997", 104], ["02/10/2001", 15370], ["04/07/2001", 16253], ["05/30/2002", 21087], ["11/16/2002", 23652], ["10/12/2002", 23089], ["11/18/2002", 23652], ["06/13/2003", 27524], ["06/14/2003", 27551], ["10/29/2003", 30429], ["11/04/2003", 30594], ["12/30/2003", 31556], ["03/26/2004", 34202], ["03/28/2004", 34231], ["07/24/2004", 37725], ["11/24/2004", 39770], ["05/07/2005", 41141], ["10/01/2005", 42390], ["12/23/2005", 42854], ["04/08/2006", 43539], ["07/22/2006", 44599], ["11/25/2006", 45898], ["01/27/2007", 46507], ["03/03/2007", 46972], ["06/16/2007", 48840], ["07/28/2007", 49513], ["01/26/2008", 50957], ["05/24/2008", 51533], ["07/26/2008", 52823], ["08/02/2008", 52976]];

var uscData = [["05/30/2009", 57938],["06/06/2009", 58107],["07/25/2009", 59387],["02/13/2010", 62865],["08/07/2010", 67392],["08/08/2010", 67408],["05/19/2011", 72732],["08/07/2011", 76982],["01/31/2012", 79914],["02/06/2012", 79978],["04/28/2012", 80964],["09/22/2012", 86537],["02/27/2013", 88888],["06/22/2013", 90950]];

var laData = [["08/20/2013", 92962],["12/10/2013", 94997],["12/21/2013", 95300],["02/20/2014", 97003],["06/14/2014", 98630],["07/15/2014", 99219],["01/04/2015", 101232],["05/21/2015", 103684]];

var data = [];
data = data.concat(abqData);
data = data.concat(uscData);
data = data.concat(laData);

// let's get this party started
data = convertAllYearsInData(data);

// we need this for the regression line
var result = regression('linear', data);
var earliestIndex = getEarliestOrLatestIndex(data, true);
var latestIndex = getEarliestOrLatestIndex(data, false);
var firstX = data[earliestIndex][0];
var lastX = data[latestIndex][0];
var firstY = useRegressionEquation(result, firstX);
var lastY = useRegressionEquation(result, lastX);
regressionRange = [[firstX, firstY], [lastX, lastY]];

$(function(){

	$("button").on("click", function(){
		$("#expected").text( useRegressionEquation( result, convertDateToNumber($("input").val()) ) );
	});

	$("#oneYear").text( Math.abs(useRegressionEquation(result, 0) - useRegressionEquation(result, 1)) );

	$('#container').highcharts({
		yAxis: {
			min: 0
		},
		title: {
			text: 'Car Mileage over Time'
		},
		series: [{
			type: 'line',
			name: 'Regression Line',
			data: regressionRange,
			marker: {
				enabled: false
			},
			states: {
				hover: {
					lineWidth: 0
				}
			},
			enableMouseTracking: false
		}, {
			type: 'scatter',
			name: 'Data',
			data: data,
			marker: {
				radius: 4
			}
		}]
	});
});
