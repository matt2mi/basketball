'use strict';
const Gpio = require('onoff').Gpio;

module.exports = class LaserBarrier {

    init() {
        console.log('init');
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

    startListeningLoop() {
        this.init();
        let counter = 0;

        while (counter < 50) {
            setTimeout(() => {
                console.log('value', this.PHOTO_RESISTANCE);
                counter += 1
            }, 300);
        }
    }

    stopListening() {
        this.PHOTO_RESISTANCE.unexport();
    }
};