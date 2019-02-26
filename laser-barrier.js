'use strict';
const Gpio = require('onoff').Gpio;

module.exports = class LaserBarrier {

    constructor(ledsHandler) {
        console.log('laser.js => init');
        this.PHOTO_RESISTANCE = new Gpio(20, 'in');

        this.ledsHandler = ledsHandler;
    }

    startListening() {
        console.log('laser.js => startListening');

        console.log('===== DEBUT DE PARTIE =====');

        let count = 0;
        let ballPassing = false;

        const interval = setInterval(() => {
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
            if(count > 10) {
                this.ledsHandler.stop();
                clearInterval(interval);
                console.log('===== FIN DE PARTIE =====');
            }
        }, 100);
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
