const Gpio = require('onoff').Gpio;

const led0 = new Gpio(0, 'out');
const led1 = new Gpio(1, 'out');
const led2 = new Gpio(2, 'out');
const led3 = new Gpio(3, 'out');
const led4 = new Gpio(4, 'out');
const led5 = new Gpio(5, 'out');
const led7 = new Gpio(20, 'in');

led0.writeSync(0);
led1.writeSync(0);
led2.writeSync(0);
led3.writeSync(0);
led4.writeSync(0);
led5.writeSync(0);

led0.unexport();
led1.unexport();
led2.unexport();
led3.unexport();
led4.unexport();
led5.unexport();

led7.unexport();
