const Hapi = require('hapi');
const Nes = require('nes');

const FlowingLeds = require('./flowing-leds.js');
const flowingLeds = new FlowingLeds();

const port = 3005;
const server = new Hapi.Server({port});

let countdownTimer;
let score = 0;

const onConnection = () => {
    console.log('1');
    startFlowingLeds();
    setTimeout(() => {
        console.log('timeout 1');
        stopLeds();
        startWizzingLeds();
        setTimeout(() => {
            console.log('timeout 2');
            stopLeds();
            startFlowingLeds();
        }, 2000);
    }, 2000);
};

const onDisconnection = () => {
    console.log('onDisconnection');
    stopLeds();
};

const startSimulatingScore = () => {
    console.log('2');
    countdownTimer = setInterval(() => {
        console.log('wizz on basket');
        startWizzingLeds();
        score = score + 2;
        server.publish('/clutch', {newScore: 2});

        if (score > 9) {
            stopParty();
        }
    }, 3000);
};

const stopParty = () => {
    stopLeds();
    console.log('stop');
    clearInterval(countdownTimer);
    score = 0;
};

const startFlowingLeds = () => {
    console.log('flowing');
    flowingLeds.startFlowing();
};

const startWizzingLeds = () => {
    console.log('Wizzing');
    flowingLeds.startWizzing();
};

const stopLeds = () => {
    console.log('stop leds');
    flowingLeds.stop();
};

const start = async () => {
    await server.register({
        plugin: Nes,
        options: {
            onConnection, onDisconnection
        }
    });

    server.route({
        method: 'GET',
        path: '/start',
        config: {
            id: 'start',
            handler: (request, h) => {
                startSimulatingScore();
                return h.response('Party started !').code(200);
            }
        }
    });
    server.route({
        method: 'GET',
        path: '/flow',
        handler: (request, h) => {
            startFlowingLeds();
            return h.response('flowing started !').code(200);
        }
    });
    server.route({
        method: 'GET',
        path: '/wizz',
        handler: (request, h) => {
            startWizzingLeds();
            return h.response('wizzing started !').code(200);
        }
    });
    server.route({
        method: 'GET',
        path: '/stop-leds',
        handler: (request, h) => {
            stopLeds();
            return h.response('leds stopped!').code(200);
        }
    });
    server.route({
        method: 'GET',
        path: '/stop',
        config: {
            id: 'stop',
            handler: (request, h) => {
                stopParty();
                return h.response('party stopped !').code(200);
            }
        }
    });

    server.subscription('/clutch');
    await server.start();

    console.log('ws server started at', port);
};

start();