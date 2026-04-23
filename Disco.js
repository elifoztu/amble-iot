const dotstar = require('dotstar');
const SPI = require('pi-spi'); // Requires pi-spi library

// Initialize SPI
const spi = SPI.initialize('/dev/spidev0.0');
const ledStripLength = 60; // Set to your strip length
const ledStrip = new dotstar.Dotstar(spi, { length: ledStripLength });

let offset = 0;

function rotateColors() {
  for (let i = 0; i < ledStripLength; i++) { // rotate through each LED
    // Calculate hue based on position and time offset
    // Set HSV (Hue, Saturation, Value) to create a rainbow effect
        const hue = Math.floor(((i + offset) % ledStripLength) / ledStripLength * 255); // Hue cycles through 0-255 for a rainbow effect
        ledStrip.set(i, hue, (hue + 80) % 255, (hue + 160) % 255, 0.5); 
  }
  

  ledStrip.sync();
  offset = (offset + 1) % ledStripLength; // Move offset
}

// Update at ~30 FPS
setInterval(rotateColors, 1000 / 30);
