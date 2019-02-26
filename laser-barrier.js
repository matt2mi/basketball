'use strict';
const Gpio = require('onoff').Gpio;

class LaserBarrier {

    constructor(ledsHandler) {
        console.log('laserBarrier.js => init');
        this.PHOTO_RESISTANCE = new Gpio(20, 'in');

        this.ledsHandler = ledsHandler;
    }

    startListening(server) {
        console.log('laserBarrier.js => startListening');

        console.log('===== DEBUT DE PARTIE =====');

        let count = 0;
        let ballPassing = false;

        const interval = setInterval(() => {
            let val = this.PHOTO_RESISTANCE.readSync();
            if (val && !ballPassing) {
                ballPassing = !ballPassing;
                console.log('laserBarrier.js => swishing !!', val);
                this.ledsHandler.startWizzing();
                count += 2;
                server.publish('/swish', { score: count });
                console.log('score:', count);

                if (count > 10) {
                    server.publish('/gameover');
                    clearInterval(interval);
                    console.log('===== FIN DE PARTIE =====');
                    setTimeout(() => {
                        this.ledsHandler.stop();
                    }, 2000);
                }
            }
            if (!val && ballPassing) {
                ballPassing = !ballPassing;
                console.log('laserBarrier.js => ball passed');
            }
        }, 50);
    }

    stopListening() {
        console.log('laserBarrier.js => stopListening');
        // TODO : interrupt start fct
    }

    kill() {
        console.log('laserBarrier.js => kill');
        this.PHOTO_RESISTANCE.unexport();
    }
}

module.exports = LaserBarrier;