const Hapi = require('hapi');
const Nes = require('nes');

const port = 3005;
const server = new Hapi.Server({port});

let countdownTimer;
let score = 0;

const stopParty = () => {
    console.log('stop');
    clearInterval(countdownTimer);
    score = 0;
};

const startSimulatingScore = () => {
    countdownTimer = setInterval(() => {
        score = score + 2;
        server.publish('/clutch', {newScore: 2});

        if (score > 6) {
            stopParty();
        }
    }, 3000);
};

const start = async () => {
    await server.register(Nes);

    server.route({
        method: 'GET',
        path: '/start',
        config: {
            id: 'start',
            handler: (request, h) => {
                startSimulatingScore();
                return {msg: 'let\'s go !'};
            }
        }
    });
    server.route({
        method: 'GET',
        path: '/stop',
        config: {
            id: 'stop',
            handler: (request, h) => {
                stopParty();
                return {msg: 'party stopped'};
            }
        }
    });

    server.subscription('/clutch');
    await server.start();

    console.log('ws server started at', port);
};

start();