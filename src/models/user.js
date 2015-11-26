import PomoTimer from './pomo-timer';

export default class User {
  constructor(attrs = null) {
    this.attrs = attrs || {};
  }
  get pomo() {
    return new PomoTimer(this.attrs.pomo);
  }
}
