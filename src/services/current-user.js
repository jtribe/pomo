import React from 'react-native';
import {
  AsyncStorage
} from 'react-native';
import Services from '../services';
import uuid from 'uuid';
import EventEmitter from 'EventEmitter';
let {
  Device
} = React.NativeModules;
let storageKey = 'userId';

export default class CurrentUser extends EventEmitter {
  constructor() {
    super();
    this.snapshot = null;
    // load user from local storage first
    // this contains their UUID, and also provides a faster load time
    this.attrs = AsyncStorage.getItem(storageKey).then(str => {
      var attrs = str && JSON.parse(str);
      if (attrs) {
        return attrs;
      }
      else {
        let id = uuid.v4();
        return new Promise((resolve, reject) => Device && Device.deviceName(resolve))
          .then(name => {
            let attrs = {id, name};
            return AsyncStorage.setItem(storageKey, JSON.stringify(attrs))
              .then(() => attrs);
          });
      }
    });
    this.attrs.then(attrs => {
      // if we didn't already receive a response from the server
      if (!this.snapshot) this.emit('value', attrs);
    });
    this.ref().then(ref => {
      // listen to any changes from the server
      ref.on('value', snapshot => {
        if (snapshot.exists()) {
          // and update local storage
          var attrs = snapshot.val();
          attrs.id = ref.key();
          AsyncStorage.setItem(storageKey, JSON.stringify(attrs));
          this.emit('value', attrs);
        }
        else {
          this.attrs.then(attrs => ref.update(attrs));
        }
      });
    });
  }
  ref() {
    return this.getId().then(id => this.store.ref('user', id));
  }
  getId(create = true) {
    return this.attrs.then(attrs => attrs.id);
  }
  // emits the current user object
  onValue(cb) {
    this.addListener('value', cb);
  }
  removeValueListener(cb) {
    this.removeListener('value', cb);
  }
}
