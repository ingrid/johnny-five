var five = require("johnny-five"),
    board = new five.Board();

board.on("ready", function() {
  var mic = new five.Sensor("A3"),
      led = new five.Led(5),
      baseline, // Determined by the averaged ambient levels and the threshold.
      threshold = 40, // How much 'louder' the signal has be than the ambient
                      // levels before it is noticed. Adjust to make the mic
                      // more or less sensitive.
      readings = 0,
      accumulator = 0;

  mic.on("data", function() {
    if ( !baseline ) {
      // Calibrate the mic.
      if ( readings >= 10 ) {
        baseline = Math.floor(acc/readings) + threshold;
      } else {
        accumulator += this.value;
        readings ++;
      }
    } else {
      // Once calibrated, use the mic to turn the light on with loud sounds.
      if ( this.value > baseline ) {
        led.on();
      } else {
        led.off();
      }
    }
  });
});
