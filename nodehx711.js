'use strict';

var currentValue = 0
var tareValue = 0
let { PythonShell } = require('python-shell');
let pyshell = new PythonShell('hx711py/example.py');
pyshell.on('message', function (message) {
	console.log("absolutes Gewicht: " + message);
	console.log("relatives Gewicht: " + message-tareValue);
	currentValue = message;
});

//reads the weight
exports.getWeight = function () {
	return currentValue - tareValue
}

//tares the scale
exports.tare = function (callback) {
	tareValue = currentValue;
}
