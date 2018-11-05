'use strict';

var tareValue = 0;
var values = new Array(20);
var queue = Array(20);
values.fill(0);
queue.fill(0);

let { PythonShell } = require('python-shell');
let pyshell = new PythonShell('hx711py/example.py',{pythonPath :"/usr/bin/python2"});
pyshell.on('message', function (message) {
	console.log("absolutes Gewicht: " + message);
	addValue(message);
	console.log("relatives Gewicht: " + exports.getWeight());
	if(Math.abs(counter++) % 5 === 0){
		exports.newWeightCallback();
	}
});

function getRawValue(){
	
	return (parseFloat(values[Math.floor(values.length/2)])+parseFloat(values[Math.ceil(values.length/2)]))/2;
}

function addValue(value){
	queue.push(value);
	//find value to replace
	var oldestValue = queue.shift();
	var oldestIndex = values.indexOf(oldestValue);
	if(oldestIndex === -1){
		new Error("internal error: invariant violation");
	}
	//replace
	values[oldestIndex] = value;
	//sort (modified bubble sort to insert one element)
	var i = oldestIndex;
	if(values[Math.max(0,i-1)]<=values[i]){
		//move maybe to left
		while(!(values[i] <= values[Math.min(i+1,values.length-1)])){
			var temp = values[i+1];
			values[i+1] = values[i];
			values[i] = temp;
			i++;
		}
	}else{
		//move to right
		while(!(values[Math.max(0,i-1)]<=values[i])){
			var temp = values[i-1];
			values[i-1] = values[i];
			values[i] = temp;
			i--;
		}
	}

}

//reads the weight
exports.getWeight = function () {
	return getRawValue() - tareValue;
}

//tares the scale
exports.tare = function (callback) {
	tareValue = getRawValue();
}

var counter = 0;
exports.newWeightCallback = function(){
	
};
