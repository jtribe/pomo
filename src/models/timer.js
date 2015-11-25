import util from 'util';

export default class Timer {

  constructor(props = null) {
    this.duration = Timer.defaultDuration;
    this.isRunning = false;
    this.lastStarted = null;
    this.lastElapsed = 0;
    Object.assign(this, props || {});
  }
  get elapsed() {
    if (!this.isRunning || this.lastStarted == null) {
      return this.lastElapsed;
    }
    else {
      return Date.now() - this.lastStarted.getTime() + this.lastElapsed;
    }
  }
  set elapsed(millis) {
    this.lastElapsed = millis;
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
      this.lastElapsed += Date.now() - this.lastStarted.getTime();
    }
    this.lastStarted = null;
    this.isRunning = false;
  }
  reset() {
    this.stop();
    this.lastElapsed = 0;
  }
}

Timer.defaultDuration = 25 * 60000;

function pad(str, width, padStr = 0) {
  str = String(str);
  return str.length >= width ? str : new Array(width - str.length + 1).join(padStr) + str;
}
