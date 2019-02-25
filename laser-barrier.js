'use strict';
const Gpio = require('onoff').Gpio;

module.exports = class LaserBarrier {

    constructor(ledsHandler) {
        console.log('laser.js => init');
        this.PHOTO_RESISTANCE = new Gpio(20, 'in');

        this.ledsHandler = ledsHandler;
    }

    async startListening() {
        console.log('laser.js => startListening');

        let count = 0;
        let ballPassing = false;

        while (count < 10) {
            let val = this.PHOTO_RESISTANCE.readSync();
            if (val && !ballPassing) {
                ballPassing = !ballPassing;
                console.log('laser.js => swishing !!', val);
                this.ledsHandler.lightAllLeds();
                count += 2;
                await setTimeout(() => this.ledsHandler.switchOffAllLeds(), 400);
            }
            if (!val && ballPassing) {
                ballPassing = !ballPassing;
                console.log('laser.js => ball not passing anymore');
            }
        }
    }

    stopListening() {
        console.log('laser.js => stopListening');
        // TODO : interrupt start fct
    }

    kill() {
        console.log('laser.js => kill');
        this.PHOTO_RESISTANCE.unexport();
    }
};