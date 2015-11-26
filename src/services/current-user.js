import {
  AsyncStorage
} from 'react-native';
import Services from '../services';
import User from '../models/user';
import uuid from 'uuid';
import EventEmitter from 'EventEmitter';
let storageKey = 'userId';

export default class CurrentUser extends EventEmitter {
  constructor() {
    super();
    this.snapshot = null;
    this.local = AsyncStorage.getItem(storageKey)
      .then(str => JSON.parse(str));
    this.local.then(attrs => {
      if (!this.snapshot) this.emit('value', new User(attrs));
    });
    this.getRef().then(ref => {
      ref.on('value', snapshot => {
        this.snapshot = snapshot;
        var attrs = snapshot.val();
        if (!attrs) return;
        attrs.id = ref.key();
        AsyncStorage.setItem(storageKey, JSON.stringify(attrs));
        this.emit('value', new User(attrs));
      });
    });
  }
  getRef() {
    if (this.ref) return Promise.resolve(this.ref);
    return this.getId().then(
      id => this.ref = this.db.get(`user/${id}`)
    );
  }
  getId(create = true) {
    return this.local.then(
      attrs => attrs.id || (create ? this.generateId() : null)
    );
  }
  generateId() {
    var id = uuid.v4();
    return AsyncStorage.setItem(storageKey, JSON.stringify({id}))
      .then(() => id);
  }
  set(user) {
    return this.getRef().then(ref => ref.set(user));
  }
  updatePomo(pomo) {
    return this.set({
      pomo: pomo.state
    });
  }
}
Object.assign(CurrentUser.prototype, {
  on: EventEmitter.prototype.addListener,
  off: EventEmitter.prototype.removeListener
});
