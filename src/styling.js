let blue = '#2196F3';
let red = '#F44336';
let grey = '#333';

export default {
  blue,
  red,
  grey,
  resting: blue,
  working: red,
  paused: grey,
  pomoColor(pomo) {
    return pomo.isRunning
      ? pomo.isResting ? this.resting : this.working
      : this.paused
  }
};
