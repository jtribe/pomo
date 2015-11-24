import Timer from './timer';
import Rx from 'rx';

export default class PomoTimer {
  constructor(props = null) {
    props = props || {};
    this.timer = new Timer(props);
    this.restDuration = props.restDuration || PomoTimer.defaultRestDuration;
    this.duration = this.timer.duration;
    this.pomoDuration = this.duration - this.restDuration;
    this.rest = new Timer(Object.assign(props, {
      duration: this.restDuration
    }));
    this.pomo = new Timer(Object.assign(props, {
      duration: this.pomoDuration
    }));
  }
  get state() {
    if (this.timer.remaining === 0 || this.timer.remaining > this.restDuration) {
      return 'working';
    }
    else {
      return 'resting';
    }
  }
  get currentTimer() {
    if (this.timer.elapsed >= this.duration) {
      this.timer.elapsed = this.timer.elapsed % this.duration;
    }
    let timer = this.state === 'working' ? this.pomo : this.rest;
    timer.isRunning = this.timer.isRunning;
    timer.elapsed = this.timer.elapsed;
    if (this.state === 'resting') {
      timer.elapsed -= this.pomoDuration;
    }
    return timer;
  }
  get isResting() {
    return this.state === 'resting';
  }
}
PomoTimer.defaultRestDuration = 300000;

// delegate a number of properties to the currentTimer object
for (let prop of ['start', 'stop', 'reset']) {
  PomoTimer.prototype[prop] = function() {
    return this.timer[prop].apply(this.timer, arguments);
  };
}
