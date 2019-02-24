'use strict';
const Gpio = require('onoff').Gpio;

module.exports = class LaserBarrier {

    interval= null;

    init() {
        console.log('init');
        this.PHOTO_RESISTANCE = new Gpio(20, 'in');
    }

    startListening() {
        this.init();

        console.log('startListening');
        let count = 0;

        this.interval = setInterval(() => {
            count += 1;
            console.log('value', this.PHOTO_RESISTANCE);
        }, 500);
    }

    stopListening() {
        clearInterval(this.interval);
        this.PHOTO_RESISTANCE.unexport();
    }
};