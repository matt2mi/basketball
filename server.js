'use strict';

const Hapi = require('hapi');
const Path = require('path');
const Gpio = require('onoff').Gpio;

// Create a server with a host and port
const server = Hapi.server({
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 3000,
    routes: {
        files: {
            relativeTo: Path.join(__dirname, 'build')
        }
    }
});

// Flowing leds script
//Put all the LED variables in an array
//use declare variables for all the GPIO output pins
const leds = [
    new Gpio(4, 'out'),
    new Gpio(17, 'out'),
    new Gpio(27, 'out'),
    new Gpio(22, 'out'),
    new Gpio(18, 'out'),
    new Gpio(23, 'out'),
    new Gpio(24, 'out'),
    new Gpio(25, 'out')
];

let indexCount = 0;
//variable for flowing direction
let dir = "up";

const flowingLeds = () => {
    leds.forEach(function (currentValue) {
        currentValue.writeSync(0); //turn off LED
    });
    if (indexCount === 0) dir = "up"; //set flow direction to "up" if the count reaches zero
    if (indexCount >= leds.length) dir = "down"; //set flow direction to "down" if the count reaches 7
    if (dir === "down") indexCount--; //count downwards if direction is down
    leds[indexCount].writeSync(1); //turn on LED that where array index matches count
    if (dir === "up") indexCount++ //count upwards if direction is up
};

//run the flowingLeds function every 100ms
let flowInterval;
const startFlowing = () => {
    flowInterval = setInterval(flowingLeds, 100);
};
const stopFlowing = () => {
    //function to run when user closes using ctrl+cc
    clearInterval(flowInterval); //stop flow interwal
    leds.forEach(function (currentValue) { //for each LED
        currentValue.writeSync(0); //turn off LED
        currentValue.unexport(); //unexport GPIO
    });
};

// Start the server
const init = async () => {
    await server.register(require('inert'));

    // Add the route
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: './',
                index: true
            }
        }
    });
    server.route({
        method: 'GET',
        path: '/matt2mi/basketball/{file*}',
        handler: {
            directory: {
                path: '.'
            }
        }
    });
    server.route({
        method: 'GET',
        path: '/start-flowing',
        handler: (request, h) => {
            console.log('startFlowing');
            startFlowing();
            return 'Flowing started !';
        }
    });
    server.route({
        method: 'GET',
        path: '/stop-flowing',
        handler: (request, h) => {
            console.log('stopFlowing');
            stopFlowing();
            return 'Flowing stopped !';
        }
    });

    console.log('flowing leds routes loaded');

    require('./ws-server');

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();