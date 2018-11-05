var rpio = require('rpio');
var options = {
        gpiomem: true,          /* Use /dev/gpiomem */
        mapping: 'gpio',   
        mock: undefined,        /* Emulate specific hardware in mock mode */
}
rpio.init(options);

rpio.open(17, rpio.INPUT);
console.log('Pin 11 is currently ' + (rpio.read(17) ? 'high' : 'low'));

setInterval(checkButton,10);

function checkButton(){
	var read = rpio.read(17);
	if(!read){
		console.log('Pin 11 is currently ' + (read ? 'high' : 'low'));
		exports.buttonCallback();
	}
	//console.log('Pin 11 is currently ' + (rpio.read(17) ? 'high' : 'low'));
}

exports.buttonCallback = function(){
	
}