'use strict';
const Gpio = require('onoff').Gpio;
const FlowingLeds = require('./flowing-leds.js');

module.exports = class LaserBarrier {

    constructor() {}

    init() {
        console.log('laser.js => init');
        this.PHOTO_RESISTANCE = new Gpio(20, 'in');

        this.ledsHandler = new FlowingLeds();
    }

    startListening() {
        console.log('laser.js => startListening');
        this.init();

        let count = 0;
        let ballPassing = false;

        while (count < 10) {
            let val = this.PHOTO_RESISTANCE.readSync();
            if (val && !ballPassing) {
                ballPassing = !ballPassing;
                console.log('laser.js => swishing !!', val);
                this.ledsHandler.startWizzing();
                count += 2;
            }
            if (!val && ballPassing) {
                ballPassing = !ballPassing;
                console.log('laser.js => ball not passing anymore');
            }
        }
    }

    stopListening() {
        console.log('laser.js => stopListening');
        this.PHOTO_RESISTANCE.unexport();
        this.ledsHandler.switchOffAllLeds();
    }
};