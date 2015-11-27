import {
  AsyncStorage
} from 'react-native';
import Services from '../services';
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
      if (!this.snapshot) {
        this.emit('value', attrs);
      }
    });
    this.getRef().then(ref => {
      ref.on('value', snapshot => {
        this.emit('value', snapshot.val());
        var attrs = snapshot.val();
        if (attrs) attrs.id = ref.key();
        AsyncStorage.setItem(storageKey, JSON.stringify(attrs));
      });
    });
  }
  getRef() {
    if (this.ref) return Promise.resolve(this.ref);
    return this.getId().then(
      id => this.ref = this.store.ref('user', id)
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
}
Object.assign(CurrentUser.prototype, {
  on: EventEmitter.prototype.addListener,
  off: EventEmitter.prototype.removeListener
});
