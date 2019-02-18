const Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO

const LED1 = new Gpio(0, 'out');
const LED2 = new Gpio(1, 'out');
const LED3 = new Gpio(2, 'out');
const LED4 = new Gpio(3, 'out');
const LED5 = new Gpio(4, 'out');
const LED6 = new Gpio(5, 'out');

LED1.writeSync(0);
LED2.writeSync(0);
LED3.writeSync(0);
LED4.writeSync(0);
LED5.writeSync(0);
LED6.writeSync(0);

const blinkInterval = setInterval(blinkLedOnStart, 150); //run the blinkLED function every 250ms
let state = 1;

function blinkLedOnStart() {
    if(state) {
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

function endBlink() {
    clearInterval(blinkInterval);
    LED1.writeSync(0);
    LED2.writeSync(0);
    LED3.writeSync(0);
    LED4.writeSync(0);
    LED5.writeSync(0);
    LED6.writeSync(0);

    LED1.unexport();
    LED2.unexport();
    LED3.unexport();
    LED4.unexport();
    LED5.unexport();
    LED6.unexport();
}

setTimeout(endBlink, 2000); //stop blinking after 5 seconds

/*

import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

print "+-----------------------------------------------------------+"
print "|   Mesure de distance par le capteur ultrasonore HC-SR04   |"
print "+-----------------------------------------------------------+"

Trig = 23          # Entree Trig du HC-SR04 branchee au GPIO 23
Echo = 24         # Sortie Echo du HC-SR04 branchee au GPIO 24

GPIO.setup(Trig,GPIO.OUT)
GPIO.setup(Echo,GPIO.IN)

GPIO.setup(0,GPIO.OUT)
GPIO.setup(1,GPIO.OUT)
GPIO.setup(2,GPIO.OUT)
GPIO.setup(3,GPIO.OUT)
GPIO.setup(4,GPIO.OUT)
GPIO.setup(5,GPIO.OUT)

GPIO.output(0, True)
GPIO.output(1, True)
GPIO.output(2, True)
GPIO.output(3, True)
GPIO.output(4, True)
GPIO.output(5, True)

time.sleep(0.1)

GPIO.output(0, False)
GPIO.output(1, False)
GPIO.output(2, False)
GPIO.output(3, False)
GPIO.output(4, False)
GPIO.output(5, False)

time.sleep(0.1)

GPIO.output(Trig, False)

# repet = input("Cmb de tps (ms) ? : ")

score = 0
swishing = False

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
