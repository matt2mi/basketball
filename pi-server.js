const Hapi = require('hapi');
const Nes = require('nes');
const LedsHandler = require('./flowing-leds.js');
const LaserBarrier = require('./laser-barrier');

class PiServer {

    constructor() {
        this.ledsHandler = new LedsHandler();
        this.laserBarrier = new LaserBarrier(this.ledsHandler);

        this.port = 3005;
        this.server = new Hapi.Server({port: this.port});

        this.countdownTimer = null;
        this.score = 0;
    }

    onConnection() {
        // TODO : marche pas
        console.log('onConnection');
        // this.ledsHandler.startWizzing();
    }

    onDisconnection() {
        // TODO : marche pas
        console.log('onDisconnection');
        // this.ledsHandler.switchOffAllLeds();
    }

    killProcesses() {
        console.log('killProcesses');
        this.laserBarrier.kill();
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
                    this.laserBarrier.startListening(this.server);
                    return h.response('Party started !').code(200);
                }
            }
        });

        this.server.subscription(
            '/swish',
            {
                onUnsubscribe: () => console.log('unsub swish'),
                onSubscribe: () => console.log('sub swish')
            }
        );
        this.server.subscription(
            '/gameover',
            {
                onUnsubscribe: () => console.log('unsub gameover'),
                onSubscribe: () => console.log('sub gameover')
            }
        );
        await this.server.start();
        console.log('ws server started at', this.port);
    };
}

module.exports = PiServer;
