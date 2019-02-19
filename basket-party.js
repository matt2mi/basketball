const Gpio = require('onoff').Gpio;

const LED1 = new Gpio(0, 'out');
const LED2 = new Gpio(1, 'out');
const LED3 = new Gpio(2, 'out');
const LED4 = new Gpio(3, 'out');
const LED5 = new Gpio(4, 'out');
const LED6 = new Gpio(5, 'out');

const TRIG = new Gpio(23, 'out');
const ECHO = new Gpio(24, 'in');

(async () => {
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

    const swishingFct = async () => {
        console.log('swish !!');
        swishing = true;
        score = score + 2;
        console.log(`score: ${score} points`);

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
            swishingFct();
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
})();


/*

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)





# for x in range(repet):    # On prend la mesure "repet" fois
while True:
time.sleep(0.001)       # On la prend toute les 1 milli-seconde

GPIO.output(Trig, True)
time.sleep(0.00001)
GPIO.output(Trig, False)

while GPIO.input(Echo)==0:  ## Emission de l'ultrason
debutImpulsion = time.time()

while GPIO.input(Echo)==1:   ## Retour de l'Echo
finImpulsion = time.time()

distance = round((finImpulsion - debutImpulsion) * 340 * 100 / 2, 1)  ## Vitesse du son = 340 m/s

if swishing == False and distance <= 10:
print "swish !!"
swishing = True
score = score + 2
print "score: ",score," points"
GPIO.output(0, True)
time.sleep(0.05)
GPIO.output(1, True)
time.sleep(0.05)
GPIO.output(2, True)
time.sleep(0.05)
GPIO.output(3, True)
time.sleep(0.05)
GPIO.output(4, True)
time.sleep(0.05)
GPIO.output(5, True)
time.sleep(0.05)
GPIO.output(0, False)
time.sleep(0.05)
GPIO.output(1, False)
time.sleep(0.05)
GPIO.output(2, False)
time.sleep(0.05)
GPIO.output(3, False)
time.sleep(0.05)
GPIO.output(4, False)
time.sleep(0.05)
GPIO.output(5, False)

if swishing == True and distance > 10:
print "fin de swish"
swishing = False

if score > 10:
break

GPIO.cleanup()
*/
