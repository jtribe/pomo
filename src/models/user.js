import PomoTimer from './pomo-timer';

class Model {
  constructor(snapshot) {
    this.snapshot = snapshot;
    this.attrs = snapshot.val();
  }
  get ref() {
    return this.snapshot.ref();
  }
}

export default class User extends Model {
  get pomo() {
    return new PomoTimer(this.attrs.pomo);
  }
}
