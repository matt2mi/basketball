'use strict';
const Gpio = require('onoff').Gpio;

module.exports = class LaserBarrier {

    init() {
        this.PHOTO_RESISTANCE = new Gpio(20, 'in');
    }

    startListening() {
        this.init();

        this.PHOTO_RESISTANCE.watch((err, value) => {
            if (err) {
                throw err;
            }
            if (value) {
                console.log('coucou', value);
            }
        });
    }

    stopListening() {
        this.PHOTO_RESISTANCE.unexport();
    }
};