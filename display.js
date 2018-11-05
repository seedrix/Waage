var oled = require('oled-ssd1306-i2c');
var font = require('oled-font-5x7');
 
var opts = {
  width: 128,
  height: 32,
  address: 0x3c
};
 
var oled = new oled(opts);
oled.turnOnDisplay();
oled.clearDisplay();
oled.fillRect(1, 1, 128, 32, 0);
oled.setCursor(1, 1);
oled.writeString(font, 3, 'Waage', 1, true);
oled.setCursor(100, 20);
oled.writeString(font, 1, 'V0.1', 1, true);

exports.print = function(text){
oled.clearDisplay();
oled.setCursor(1, 1);

oled.writeString(font, 4, String(text),1,true);
oled.setCursor(100, 16);
oled.writeString(font, 2, 'g', 1, true);
}
oled.clearDisplay();
process.on('SIGINT', function(){
  oled.turnOffDisplay();
  process.exit();
});