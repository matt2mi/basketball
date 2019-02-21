'use strict';
const Gpio = require('onoff').Gpio;

module.exports = class FlowingLeds {

    constructor() {
    }

    init() {
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

        this.flowInterval = null;
    }

    start() {
        this.init();
        // run the flowingLeds function every 100ms
        this.flowInterval = setInterval(() => this.flowingLeds(), 100);
    }

    stop() {
        // function to run when user closes using ctrl+cc
        this.unexportOnClose(this.flowInterval);
    }

    // function for flowing Leds
    flowingLeds() {
        // turn off all leds
        this.leds.forEach(currentValue => currentValue.writeSync(0));
        if (this.indexCount === 0) this.dir = "up"; //set flow direction to "up" if the count reaches zero
        if (this.indexCount >= this.leds.length) this.dir = "down"; //set flow direction to "down" if the count reaches 7
        if (this.dir === "down") this.indexCount--; //count downwards if direction is down
        this.leds[this.indexCount].writeSync(1); //turn on LED that where array index matches count
        if (this.dir === "up") this.indexCount++ //count upwards if direction is up
    }

    unexportOnClose(flowInterval) {
        // function to run when exiting program
        clearInterval(flowInterval); //stop flow interwal
        this.leds.forEach(function(currentValue) { //for each LED
            currentValue.writeSync(0); //turn off LED
            currentValue.unexport(); //unexport GPIO
        });
    }
};

/*(async () => {
    TRIG.writeSync(0);

    LED1.writeSync(0);
    LED2.writeSync(0);
    LED3.writeSync(0);
    LED4.writeSync(0);
    LED5.writeSync(0);
    LED6.writeSync(0);

    let state = 1;

    function blinkLedOnStart() {
        if (state) {
            state = 0;
            LED1.writeSync(1);
            LED2.writeSync(1);
            LED3.writeSync(1);
            LED4.writeSync(1);
            LED5.writeSync(1);
            LED6.writeSync(1);
        } else {
            state = 1;
            LED1.writeSync(0);
            LED2.writeSync(0);
            LED3.writeSync(0);
            LED4.writeSync(0);
            LED5.writeSync(0);
            LED6.writeSync(0);
        }
    }

    const blinkInterval = setInterval(blinkLedOnStart, 150); //run the blinkLED function every 250ms
    function endBlink() {
        clearInterval(blinkInterval);
        LED1.writeSync(0);
        LED2.writeSync(0);
        LED3.writeSync(0);
        LED4.writeSync(0);
        LED5.writeSync(0);
        LED6.writeSync(0);

        // LED1.unexport();
        // LED2.unexport();
        // LED3.unexport();
        // LED4.unexport();
        // LED5.unexport();
        // LED6.unexport();
    }

    await setTimeout(endBlink, 2000); //stop blinking after 5 seconds

    let score = 0;
    let swishing = false;

    async function lightOneByOne() {
        LED1.writeSync(1);
        await setTimeout(() => {
        }, 150);
        LED2.writeSync(1);
        await setTimeout(() => {
        }, 150);
        LED3.writeSync(1);
        await setTimeout(() => {
        }, 150);
        LED4.writeSync(1);
        await setTimeout(() => {
        }, 150);
        LED5.writeSync(1);
        await setTimeout(() => {
        }, 150);
        LED6.writeSync(1);
        await setTimeout(() => {
        }, 150);
    }

    async function lightOffOneByOne() {
        LED1.writeSync(0);
        await setTimeout(() => {
        }, 150);
        LED2.writeSync(0);
        await setTimeout(() => {
        }, 150);
        LED3.writeSync(0);
        await setTimeout(() => {
        }, 150);
        LED4.writeSync(0);
        await setTimeout(() => {
        }, 150);
        LED5.writeSync(0);
        await setTimeout(() => {
        }, 150);
        LED6.writeSync(0);
        await setTimeout(() => {
        }, 150);
    }

    const swishingFct = async () => {
        console.log('swish !!');
        swishing = true;
        score = score + 2;
        console.log(`score: ${score} points`);

        await lightOneByOne();
        await lightOffOneByOne();
        await lightOneByOne();
        await lightOffOneByOne();
        await lightOneByOne();
        await lightOffOneByOne();
        await lightOneByOne();
        await lightOffOneByOne();
    };

    const gameOn = async () => {
        await setTimeout(() => {
        }, 0.001);

        TRIG.writeSync(1);
        await setTimeout(() => {
        }, 0.00001);
        TRIG.writeSync(0);

        let debutImpulsion, finImpulsion = 0;

        // Emission de l'ultrason
        while (ECHO.readSync() === 0) {
            debutImpulsion = Date.now();
        }

        // Retour de l'Echo
        while (ECHO.readSync() === 1) {
            finImpulsion = Date.now();
        }

        const distance = Math.round((finImpulsion - debutImpulsion) * 340 * 100 / 2);  // Vitesse du son = 340 m/s

        if (!swishing && distance <= 10) {
            await swishingFct();
        }
        if (swishing && distance > 10) {
            console.log('fin de swish');
            swishing = false;
        }

        if(score <= 10) {
            await gameOn();
        }
    };

    console.log('startParty');
    const startParty = Date.now();
    await gameOn();
    console.log(`Fin de partie en ${(Date.now() - startParty) / 1000} secondes`);

    // GPIO.cleanup()
})();*/

