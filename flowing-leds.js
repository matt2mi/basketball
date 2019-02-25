'use strict';
const Gpio = require('onoff').Gpio;

module.exports = class FlowingLeds {

    constructor() {
        this.init();
    }

    init() {
        console.log('flowing.js => init');
        this.LED1 = new Gpio(0, 'out');
        this.LED2 = new Gpio(1, 'out');
        this.LED3 = new Gpio(2, 'out');
        this.LED4 = new Gpio(3, 'out');
        this.LED5 = new Gpio(4, 'out');
        this.LED6 = new Gpio(5, 'out');

        // Put all the LED variables in an array
        this.leds = [this.LED1, this.LED2, this.LED3, this.LED4, this.LED5, this.LED6];

        // a counter
        this.indexCount = 0;

        // variable for flowing direction
        this.dir = "up";

        this.intervals = [];
    }

    startFlowing() {
        console.log('flowing.js => startFlowing');
        this.switchOffAllLeds();

        this.LED1.writeSync(1);
        setTimeout(() => {
            this.LED2.writeSync(1);
            this.LED1.writeSync(0);
        }, 150);
        setTimeout(() => {
            this.LED3.writeSync(1);
            this.LED2.writeSync(0);
        }, 300);
        setTimeout(() => {
            this.LED4.writeSync(1);
            this.LED3.writeSync(0);
        }, 450);
        setTimeout(() => {
            this.LED5.writeSync(1);
            this.LED4.writeSync(0);
        }, 600);
        setTimeout(() => {
            this.LED6.writeSync(1);
            this.LED5.writeSync(0);
        }, 750);
        setTimeout(() => {
            this.LED6.writeSync(1);
            this.LED5.writeSync(0);
        }, 900);
        setTimeout(() => {
            this.LED5.writeSync(1);
            this.LED6.writeSync(0);
        }, 1050);
        setTimeout(() => {
            this.LED4.writeSync(1);
            this.LED5.writeSync(0);
        }, 1200);
        setTimeout(() => {
            this.LED3.writeSync(1);
            this.LED4.writeSync(0);
        }, 1350);
        setTimeout(() => {
            this.LED2.writeSync(1);
            this.LED3.writeSync(0);
        }, 1500);
        setTimeout(() => {
            this.LED2.writeSync(1);
            this.LED1.writeSync(0);
        }, 1650);
        setTimeout(() => {
            this.LED6.writeSync(1);
            this.LED5.writeSync(0);
        }, 1800);
        setTimeout(() => this.switchOffAllLeds(), 1950);
    }

    startWizzing() {
        console.log('flowing.js => wizzing');

        // run the flowingLeds function every 100ms
        const intervalOn = setInterval(() => this.lightAllLeds(), 100);
        const intervalOff = setTimeout(() => setInterval(() => this.switchOffAllLeds(), 100), 50);
        this.intervals.push(intervalOn, intervalOff);

        setTimeout(() => this.switchOffAllLeds(), 3000);
    }

    stop() {
        console.log('flowing.js => stop - unexport leds');
        this.intervals.forEach(int => clearInterval(int));

        this.leds.forEach(currentValue => {
            currentValue.writeSync(0); //turn off LED
            currentValue.unexport(); //unexport GPIO
        });
    }

    // function for flowing Leds
    flowingLeds() {
        console.log('flowing.js => flowingLeds');
        // turn off all leds
        this.leds.forEach(currentValue => currentValue.writeSync(0));
        if (this.indexCount === 0) this.dir = "up"; //set flow direction to "up" if the count reaches zero
        if (this.indexCount >= this.leds.length) this.dir = "down"; //set flow direction to "down" if the count reaches 7
        if (this.dir === "down") this.indexCount--; //count downwards if direction is down
        this.leds[this.indexCount].writeSync(1); //turn on LED that where array index matches count
        if (this.dir === "up") this.indexCount++ //count upwards if direction is up
    }

    lightAllLeds() {
        console.log('flowing.js => lightAllLeds');
        this.LED1.writeSync(1);
        this.LED2.writeSync(1);
        this.LED3.writeSync(1);
        this.LED4.writeSync(1);
        this.LED5.writeSync(1);
        this.LED6.writeSync(1);
    }

    switchOffAllLeds() {
        console.log('flowing.js => switchOffAllLeds');
        this.LED1.writeSync(0);
        this.LED2.writeSync(0);
        this.LED3.writeSync(0);
        this.LED4.writeSync(0);
        this.LED5.writeSync(0);
        this.LED6.writeSync(0);
    }
};