import Firebase from 'firebase';

export default class Db {
  constructor() {
    this.db = new Firebase('https://intense-heat-8721.firebaseio.com/');
  }
  ref(key) {
    return this.db.child(key);
  }
  set(key, doc) {
    return this.db.child(key).set(doc);
  }
  update(key, patch) {
    return this.db.child(key).update(patch);
  }
}
