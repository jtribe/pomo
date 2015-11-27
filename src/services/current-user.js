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
    // load user from local storage first
    // this contains their UUID, and also provides a faster load time
    this.local = AsyncStorage.getItem(storageKey)
      .then(str => {
        var attrs = JSON.parse(str);
        // if we don't already have the response from the server
        if (!this.snapshot) this.emit('value', attrs);
        return attrs;
      });
    this.getRef().then(ref => {
      // listen to any changes from the server
      ref.on('value', snapshot => {
        // and update local storage
        var attrs = snapshot.val();
        if (attrs) attrs.id = ref.key();
        AsyncStorage.setItem(storageKey, JSON.stringify(attrs));
        this.emit('value', attrs);
      });
    });
  }
  getRef() {
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
  // emits the current user object
  onValue(cb) {
    this.addListener('value', cb);
  }
  removeValueListener(cb) {
    this.removeListener('value', cb);
  }
}
