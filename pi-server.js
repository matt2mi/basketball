const Hapi = require('hapi');
const Nes = require('nes');
const FlowingLeds = require('./flowing-leds.js');
const LaserBarrier = require('./laser-barrier');

class PiServer {

    constructor() {
        this.ledsHandler = new FlowingLeds();
        this.laser = new LaserBarrier(this.ledsHandler);

        this.port = 3005;
        this.server = new Hapi.Server({port: this.port});

        this.countdownTimer = null;
        this.score = 0;
    }

    onConnection() {
        // TODO : marche pas
        console.log('onConnection');
        this.ledsHandler.startWizzing();
    }

    onDisconnection() {
        // TODO : marche pas
        console.log('onDisconnection');
        this.ledsHandler.switchOffAllLeds();
    }

    killProcesses() {
        console.log('killProcesses');
        this.laser.kill();
        this.ledsHandler.stop();
    }

    async start() {
        await this.server.register({
            plugin: Nes,
            options: {
                onConnection: this.onConnection,
                onDisconnection: this.onDisconnection
            }
        });

        this.server.route({
            method: 'GET',
            path: '/start',
            config: {
                id: 'start',
                handler: (request, h) => {
                    this.laser.startListening(this.server);
                    // setTimeout(() => this.server.publish('/swish', { score: 2 }), 1000);
                    // setTimeout(() => this.server.publish('/swish', { score: 4 }), 3000);

                    return h.response('Party started !').code(200);
                }
            }
        });

        this.server.subscription(
            '/swish',
            {onUnsubscribe: console.log('unsub swish')}
        );
        this.server.subscription(
            '/gameOver',
            {onUnsubscribe: console.log('unsub game over')}
        );
        await this.server.start();

        console.log('ws server started at', this.port);
    };
}

module.exports = PiServer;