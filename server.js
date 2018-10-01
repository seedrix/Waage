'use strict';

var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var scale = require('./nodehx711.js');
var hardware = require('./hardware.js');


app.listen(8080);

function handler(req, res) {
	fs.readFile(__dirname + '/index.html',
		function (err, data) {
			if (err) {
				res.writeHead(500);
				return res.end('Error loading index.html');
			}

			res.writeHead(200);
			res.end(data);
		});
}

io.on('connection', function (socket) {
	console.log("connection!");
	socket.on("tare", function () {
		tare();
	})
});

function showWeight(weight) {
	io.emit("showWeight", Math.round(weight));
}

var checkWeightIntervalFunction = function () {
	//read weight	
	var weight = scale.getWeight()
	showWeight(weight)
	if (weight < 4 && weight > 4) {
		hardware.setLedState(0);
	}


};
//function run periodicly
var interval = null;

function startInterval() {
	if (interval === null) {
		console.log("start intervall");
		interval = setInterval(checkWeightIntervalFunction, 500);
	}
}

function stopInterval() {
	if (interval !== null) {
		console.log("stop intervall");
		clearInterval(interval);
		interval = null;
	}
}


function tare() {
	scale.tare();
}

hardware.buttonPushed = tare;

// tare();
startInterval()
hardware.setLedState(1);
