import Timer from './timer';
import Rx from 'rx';

export default class PomoTimer {
  constructor(props = null) {
    props = props || {};
    this.duration = (props.timer && props.timer.duration) || PomoTimer.defaultDuration;
    this.restDuration = props.restDuration || PomoTimer.defaultRestDuration;
    this.pomoDuration = this.duration - this.restDuration;

    this.timer = new Timer(this.duration, props.timer);
    this.pomo = new Timer(this.pomoDuration);
    this.rest = new Timer(this.restDuration);
  }
  get status() {
    if (this.timer.remaining === 0 || this.timer.remaining > this.restDuration) {
      return 'working';
    }
    else {
      return 'resting';
    }
  }
  get state() {
    return {
      restDuration: this.restDuration,
      timer: this.timer.state
    };
  }
  get currentTimer() {
    if (this.timer.elapsed >= this.duration) {
      this.timer.elapsed = this.timer.elapsed % this.duration;
    }
    let timer = this.status === 'working' ? this.pomo : this.rest;
    timer.isRunning = this.timer.isRunning;
    timer.elapsed = this.timer.elapsed;
    if (this.status === 'resting') {
      timer.elapsed -= this.pomoDuration;
    }
    return timer;
  }
  get isResting() {
    return this.status === 'resting';
  }
}
PomoTimer.defaultDuration = 30 * 60000;
PomoTimer.defaultRestDuration = 5 * 60000;
//PomoTimer.defaultDuration = 5 * 1000;
//PomoTimer.defaultRestDuration = 2 * 1000;

// delegate a number of methods to the timer object
['start', 'stop', 'reset'].map(prop => {
  PomoTimer.prototype[prop] = function() {
    return this.timer[prop].apply(this.timer, arguments);
  };
});

// delegate a number of properties to the timer object
['isRunning'].map(prop => {
  Object.defineProperty(PomoTimer.prototype, prop, {
    get() {
      return this.currentTimer[prop];
    }
  });
});
