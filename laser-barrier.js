'use strict';
const Gpio = require('onoff').Gpio;

module.exports = class LaserBarrier {

    init() {
        this.PHOTO_RESISTANCE = new Gpio(20, 'in');
    }

    startListening() {
        this.init();

        console.log('init');

        this.PHOTO_RESISTANCE.watch((err, value) => {
            if (err) {
                throw err;
            }
            console.log('coucou', value);
        });
    }

    stopListening() {
        this.PHOTO_RESISTANCE.unexport();
    }
};