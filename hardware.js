const ledPin = 22;
const rightPin = 17;
const leftPin = 27;


// time in ms a button must pressed to trigger a HOLD event
const holdTimeMs = 1000;
// in ms
const checkInterval = 10;
const pressHolbackTime = 50;

var rpio = require('rpio');

exports.buttonEvent = Object.freeze({"NONE":0,"LEFT_PRESS":1, "RIGHT_PRESS":2, "BOTH_PRESS":3, "LEFT_HOLD":4, "RIGHT_HOLD":5, "BOTH_HOLD":6});
const buttonEvent = exports.buttonEvent;
const buttonPress = {right: buttonEvent.RIGHT_PRESS, left: buttonEvent.LEFT_PRESS};
const buttonHold = {right: buttonEvent.RIGHT_HOLD, left: buttonEvent.LEFT_HOLD};

//buttons are active low
var lastState = {right:1,left: 1};
var changedTimestamp = {right:0,left: 0};
var pendingEvent = {right: buttonEvent.NONE, left : buttonEvent.NONE};
const buttons = ["right","left"];

var options = {
        gpiomem: true,          /* Use /dev/gpiomem */
        mapping: 'gpio',   
        mock: undefined,        /* Emulate specific hardware in mock mode */
};
rpio.init(options);

rpio.open(rightPin, rpio.INPUT);
rpio.open(leftPin, rpio.INPUT);
rpio.open(ledPin, rpio.OUTPUT);
console.log('rightPin '+rightPin+ ' is currently ' + (rpio.read(rightPin) ? 'high' : 'low'));
console.log('leftPin '+leftPin+' is currently ' + (rpio.read(leftPin) ? 'high' : 'low'));

setInterval(checkButtons,checkInterval);

function checkButtons(){
	var rightButton = rpio.read(rightPin);
    var leftButton = rpio.read(leftPin);
    //buttons are active low
	if(!rightButton){
		//console.log('Right Button');
	}
	if(!leftButton){
        //console.log('Left Button');
	}
	var actualState = {right:rightButton,left: leftButton};

    buttons.forEach(function (button) {
        //check for changes
        if(( actualState[button] !== lastState[button] ) ){
            // state changed
			changedTimestamp[button] = new Date().getTime();
			lastState[button] = actualState[button];
            if(actualState[button] === 0){
                pendingEvent[button] = buttonPress[button];
            }
        }
        //check pressed time
        if((pendingEvent[button] === buttonPress[button]) && (changedTimestamp[button] + holdTimeMs) <= new Date().getTime()){
            pendingEvent[button] = buttonHold[button];
		}
	});

   if(pendingEvent["right"] === buttonEvent.RIGHT_HOLD && pendingEvent["left"] === buttonEvent.LEFT_HOLD){
   	//both hold
   	pendingEvent["right"] = buttonEvent.NONE;
       pendingEvent["left"] = buttonEvent.NONE;
   	triggerAction(buttonEvent.BOTH_HOLD);
   }else if(actualState["right"] === 1 && actualState["left"] === 1 &&
	   pendingEvent["right"] === buttonEvent.RIGHT_PRESS && pendingEvent["left"] === buttonEvent.LEFT_PRESS){
   		//both released with pending press, so trigger both pressed
       pendingEvent["right"] = buttonEvent.NONE;
       pendingEvent["left"] = buttonEvent.NONE;
       triggerAction(buttonEvent.BOTH_PRESS);
   }else{
   		//maybe one pressed or hold
       buttons.forEach(function (button) {
           if(changedTimestamp[button] + pressHolbackTime <= new Date().getTime()) {
               if (pendingEvent[button] === buttonHold[button]) {
                   //hold
                   var event = pendingEvent[button];
                   pendingEvent[button] = buttonEvent.NONE;
                   triggerAction(event);
               } else if (actualState[button] === 1 && pendingEvent[button] === buttonPress[button]) {
                   // press
                   var event = pendingEvent[button];
                   pendingEvent[button] = buttonEvent.NONE;
                   triggerAction(event);
               }
           }
       });
   }
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function triggerAction(event) {
	console.log("Event "+event+ ": "+getKeyByValue(buttonEvent,event));
    exports.buttonCallback(event);
}

/**
 * Is called 
 * @param event
 */
exports.buttonCallback = function(event){
	
};

exports.setLedState = function (state) {
	if(state === 1 || state === true){
		gpio.write(ledPin, gpio.HIGH);
	}else{
        gpio.write(ledPin, gpio.LOW);
	}
};
