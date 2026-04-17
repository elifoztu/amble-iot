const { initializeApp } = require('firebase/app');
const { getDatabase, ref, child, onValue, get } = require('firebase/database');
const { exec } = require('child_process');
// const sense = require('@trbll/sense-hat-led');

// =========================
// Firebase config
// =========================
const firebaseConfig = {
    apiKey: "AIzaSyAwftLGn3PIuWMm1KxPFuG3XJEq69RPIxQ",
    authDomain: "amble-bfa94.firebaseapp.com",
    databaseURL: "https://amble-bfa94-default-rtdb.firebaseio.com",
    projectId: "amble-bfa94",
    storageBucket: "amble-bfa94.firebasestorage.app",
    messagingSenderId: "765015893097",
    appId: "1:765015893097:web:d24ffa4a090ed8d023aef8",
    measurementId: "G-EG5MBM5YH6"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


//========================================
// SPI initialization and LED strip setup
//========================================
const SPI = require('pi-spi');
const dotstar = require('dotstar');
const spi = SPI.initialize('/dev/spidev0.0');
const ledCount = 60; // Number of LEDs on your strip
const strip = new dotstar.Dotstar(spi, {
  length: ledCount
});


// =========================
// Watch current vibe
// =========================
function watchVibeAndUpdateLight() {
    const vibeRef = ref(database, "lamp/current_vibe");
    
    console.log("Listening for changes to lamp/current_vibe...");

    onValue(vibeRef, async (snapshot) => {
        try {
            
            // if no data is available, print message to console
            if (!snapshot.exists()) {
                console.log("No current_vibe data found.");
                return;
            }

            // otherwise, assign the vibe value to variable "vibe"
            const vibe = snapshot.val();

            // TO DO: get color values from "vibes" reference:
            const vibeColorRef = ref(database, "vibes");
            const dbRef = ref(getDatabase());
            get(child(dbRef, `users/${userId}`)).then((snapshot) => {
              if (snapshot.exists()) {
                console.log(snapshot.val());
              } else {
                console.log("No data available");
              }
            }).catch((error) => {
              console.error(error);
            });


            
            get(vibeColorRef) // need to figure out how to do this
            int r = 255;
            int g = 255;
            int b = 255;

            // Set all LEDs to preset colors from database at brightness 100%
            strip.all(r,g,b, 1);
            strip.sync(); // Push data to the physical strip
                 
            
            
            console.log(`Current vibe changed to: ${vibe}`);

            const rgbRef = ref(database, `vibes/${vibe}`);
            const rgbSnap = await get(rgbRef);

            if (!rgbSnap.exists()) {
                console.log(`No RGB found for vibe "${vibe}"`);
                return;
            }

            const { r, g, b } = rgbSnap.val();
            console.log(`RGB -> R:${r} G:${g} B:${b}`);

            // sense.setPixel(0, 0, r, g, b);
            console.log("LED update skipped for now.");
        } catch (error) {
            console.error("Error handling vibe update:", error);
        }
    }, (error) => {
        console.error("Firebase listener error (vibe):", error);
    });
}

// =========================
// Watch fan
// =========================
function watchFan() {
    const fanRef = ref(database, "lamp/fan");

    console.log("Listening for changes to lamp/fan...");

    onValue(fanRef, (snapshot) => {
        try {
            if (!snapshot.exists()) {
                console.log("No fan data found.");
                return;
            }

            const fanState = snapshot.val();

            if (fanState === true) {
                console.log("Fan signal received: running fan_on.py");

                exec('python3 fan_on.py', (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error running fan_on.py: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.error(`fan_on.py stderr: ${stderr}`);
                    }
                    if (stdout) {
                        console.log(`fan_on.py stdout: ${stdout}`);
                    }
                });

            } else if (fanState === false) {
                console.log("Fan signal received: running fan_off.py");

                exec('python3 fan_off.py', (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error running fan_off.py: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.error(`fan_off.py stderr: ${stderr}`);
                    }
                    if (stdout) {
                        console.log(`fan_off.py stdout: ${stdout}`);
                    }
                });

            } else {
                console.log("Fan value is not a boolean:", fanState);
            }

        } catch (error) {
            console.error("Error handling fan update:", error);
        }
    }, (error) => {
        console.error("Firebase listener error (fan):", error);
    });
}

// =========================
// Watch motor
// =========================
function watchMotor() {
    const motorRef = ref(database, "lamp/motor");

    console.log("Listening for changes to lamp/motor...");

    onValue(motorRef, (snapshot) => {
        try {
            if (!snapshot.exists()) {
                console.log("No motor data found.");
                return;
            }

            const motorState = snapshot.val();

            if (motorState === true) {
                console.log("Motor signal received: running motor_right.py");

                exec('python3 motor_right.py', (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error running motor_right.py: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.error(`motor_right.py stderr: ${stderr}`);
                    }
                    if (stdout) {
                        console.log(`motor_right.py stdout: ${stdout}`);
                    }
                });

            } else if (motorState === false) {
                console.log("Motor signal received: false (no action taken)");
            } else {
                console.log("Motor value is not a boolean:", motorState);
            }

        } catch (error) {
            console.error("Error handling motor update:", error);
        }
    }, (error) => {
        console.error("Firebase listener error (motor):", error);
    });
}

// =========================
// Clean shutdown
// =========================
process.on('SIGINT', () => {
    console.log("\nShutting down...");
    process.exit();
});

// =========================
// Start listeners
// =========================
watchVibeAndUpdateLight();
watchFan();
watchMotor();
