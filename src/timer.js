'use strict';
var util = require('util');

class Timer {

  constructor(duration = Timer.defaultDuration) {
    this.duration = duration;
    this.isRunning = false;
    this.elapsedBeforeStop = 0;
    this.lastStarted = null;
  }
  get elapsed() {
    if (!this.isRunning || this.lastStarted == null) {
      return this.elapsedBeforeStop;
    }
    else {
      return this.elapsedBeforeStop + Date.now() - this.lastStarted.getTime();
    }
  }
  get remaining() {
    return Math.max(this.duration - this.elapsed, 0);
  }
  get description() {
    let remaining = this.remaining;
    let mins = util.format("%02d", floor(remaining / 60));
    let seconds = util.format("%02d", floor(remaining % 60));
    return mins + ":" + seconds;
  }
  start() {
    if (!this.lastStarted) {
      this.lastStarted = new Date();
    }
    this.isRunning = true
  }
  stop() {
    if (this.lastStarted) {
      this.elapsedBeforeStop = Date.now() - this.lastStarted.getTime();
    }
    this.lastStarted = null;
    this.isRunning = false;
  }
  reset() {
    this.stop();
    this.elapsedBeforeStop = 0;
  }
}

Timer.defaultDuration = 25 * 60000;
module.exports = Timer;
