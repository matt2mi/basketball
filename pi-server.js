const Hapi = require('hapi');
const Nes = require('nes');
const FlowingLeds = require('./flowing-leds.js');
const LaserBarrier = require('./laser-barrier');

module.exports = class PiServer {

    constructor() {
        this.ledsHandler = new FlowingLeds();
        this.laser = new LaserBarrier();

        this.port = 3005;
        this.server = new Hapi.Server({port: this.port});

        this.countdownTimer = null;
        this.score = 0;
    }

    onConnection() {
        // TODO : marche pas
        console.log('onConnection');
        this.ledsHandler.flowingLeds();
        setTimeout(() => {
            console.log('stop onConnection');
            this.ledsHandler.switchOffAllLeds();
        }, 2000);
    }

    onDisconnection() {
        // TODO : marche pas
        console.log('onDisconnection');
        this.ledsHandler.switchOffAllLeds();
    }

    killProcesses() {
        console.log('killProcesses');
        this.laser.stopListening();
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
                    this.laser.startListening();
                    return h.response('Party started !').code(200);
                }
            }
        });
        this.server.route({
            method: 'GET',
            path: '/wizz',
            config: {
                id: 'wizz',
                handler: (request, h) => {
                    this.ledsHandler.wizzing();
                    return h.response('party stopped !').code(200);
                }
            }
        });
        this.server.route({
            method: 'GET',
            path: '/stop',
            config: {
                id: 'stop',
                handler: (request, h) => {
                    this.laser.stopListening();
                    return h.response('party stopped !').code(200);
                }
            }
        });

        this.server.subscription('/clutch');
        await this.server.start();

        console.log('ws server started at', this.port);
    };
};
