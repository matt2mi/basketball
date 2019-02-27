const Gpio = require('onoff').Gpio;
const led = new Gpio(21, 'out');
const button = new Gpio(26, 'in', 'both');

button.watch((err, value) => led.writeSync(value));
