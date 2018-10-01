'use strict';


const raspi = require('raspi');
const gpio = require('raspi-gpio');
const hardware = this;
var tareButtonEnabled = true;
var ledState = 0;



exports.buttonPushed = function (value) {

};

raspi.init(function () {
    const output = new gpio.DigitalOutput('GPIO21');
    const input = new gpio.DigitalInput({
        pin: 'GPIO20',
        pullResistor: gpio.PULL_UP
    });


    input.on('change', function (value) {
        if (tareButtonEnabled === true && value === gpio.HIGH) {
            tareButtonEnabled = false;
            console.log("taster");
			exports.buttonPushed();

//reactivate after 100ms (for debouncing)
            setTimeout(function () {
                tareButtonEnabled = true;
            }, 100);
        }
//output.write(value);
    });
    exports.setLedState = function (value) {
        if (value == 1) {
            output.write(gpio.HIGH);
        } else {
            output.write(gpio.LOW);
        }
    };
    exports.setLedState(ledState);

});

exports.setLedState = function (value) {
    ledState = value;
};

