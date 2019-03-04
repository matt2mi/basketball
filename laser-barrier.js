'use strict';

// const Gpio = require('onoff').Gpio;

class LaserBarrier {

    /*constructor(ledsHandler) {
        this.PHOTO_RESISTANCE = new Gpio(20, 'in');
        this.ledsHandler = ledsHandler;
    }

    startListening(server) {
        console.log('===== DEBUT DE PARTIE =====');

        let count, time = 30;
        let ballPassing = false;

        const timeInterval = setInterval(() => {
            time--;
            server.publish('/time', {time});
        }, 1000);

        const interval = setInterval(() => {
            let val = this.PHOTO_RESISTANCE.readSync();
            if (val && !ballPassing) {
                count += 2;
                ballPassing = this.swishing(ballPassing, count, server);

                if (time <= 0) {
                    this.gameover(server, timeInterval, interval);
                }
            }
            if (!val && ballPassing) {
                ballPassing = !ballPassing;
            }
        }, 50);
    }*/

    startListeningMock(server) {
        console.log('===== DEBUT DE PARTIE =====');

        let count = 0;
        let time = 30;

        const interval = setInterval(() => {
            time--;
            server.publish('/time', {time});
            if (time % 2 === 0) {
                count += 2;
                this.swishing(false, count, server);
            }
            if (time <= 0) {
                this.gameover(server, null, interval);
            }
        }, 1000);
    }

    swishing(ballPassing, count, server) {
        ballPassing = !ballPassing;
        // this.ledsHandler.startWizzing();
        server.publish('/swish', {score: count});
        console.log('score:', count);
        return ballPassing;
    }

    gameover(server, timeInterval, interval) {
        server.publish('/gameover', {});
        clearInterval(timeInterval);
        clearInterval(interval);
        console.log('===== FIN DE PARTIE =====');
    }

    stopListening() {
        // TODO : interrupt start fct
    }

    kill() {
        // this.PHOTO_RESISTANCE.unexport();
    }
}

module.exports = LaserBarrier;