'use strict';
const Gpio = require('onoff').Gpio;

module.exports = class LaserBarrier {

    init() {
        console.log('init');
        this.PHOTO_RESISTANCE = new Gpio(20, 'in');
    }

    startListening() {
        this.init();

        console.log('startListening');
        let count = 0;
        let ballPassing = false;

        while (count < 10) {
            let val = this.PHOTO_RESISTANCE.readSync();
            if (val && !ballPassing) {
                ballPassing = !ballPassing;
                console.log('swishing !!', val);
                count += 2;
            }
            if (!val && ballPassing) {
                ballPassing = !ballPassing;
                console.log('ball not passing anymore');
            }
        }
    }

    stopListening() {
        this.PHOTO_RESISTANCE.unexport();
    }
};