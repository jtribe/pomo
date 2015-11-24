import util from 'util';

export default class Timer {

  constructor(props = null) {
    this.duration = Timer.defaultDuration;
    this.isRunning = false;
    this.lastStarted = null;
    this.stoppedAt = null;
    Object.assign(this, props || {});
  }
  get elapsed() {
    if (!this.isRunning || this.lastStarted == null) {
      return this.stoppedAtTime || 0;
    }
    else {
      return this.stoppedAtTime + Date.now() - this.lastStarted.getTime();
    }
  }
  set elapsed(millis) {
    this.stoppedAt = new Date(millis);
    if (this.isRunning) {
      this.lastStarted = new Date();
    }
  }
  get remaining() {
    return Math.max(this.duration - this.elapsed, 0);
  }
  get minutesSeconds() {
    let remaining = this.remaining;
    let mins = Math.floor(remaining / 60000);
    let seconds = Math.ceil(remaining / 1000 % 60);
    if (seconds == 60) {
      mins++;
      seconds = 0;
    }
    return pad(mins, 2) + ":" + pad(seconds, 2).slice(0, 2);
  }
  get isFinished() {
    return this.remaining <= 0;
  }
  get stoppedAtTime() {
    return this.stoppedAt ? this.stoppedAt.getTime() : null;
  }
  start(reset = false) {
    if (reset) {
      this.reset();
    }
    if (!this.lastStarted) {
      this.lastStarted = new Date();
    }
    this.isRunning = true
  }
  stop(reset = false) {
    if (reset) {
      this.reset();
    }
    else if (this.lastStarted) {
      this.stoppedAt = new Date(
        this.stoppedAtTime + Date.now() - this.lastStarted.getTime()
      );
    }
    this.lastStarted = null;
    this.isRunning = false;
  }
  reset() {
    this.stop();
    this.stoppedAt = null;
  }
}

Timer.defaultDuration = 25 * 60000;

function pad(str, width, padStr = 0) {
  str = String(str);
  return str.length >= width ? str : new Array(width - str.length + 1).join(padStr) + str;
}
