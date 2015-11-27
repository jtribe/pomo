import User from '../models/user';

export default class Store {
  constructor() {
    this.types = {
      user: User
    };
  }
  typeRef(type) {
    return this.db.ref(type);
  }
  ref(type, id) {
    return this.typeRef(type).child(id);
  }
  model(type, snapshot) {
    let klass = this.types[type].klass;
    return new klass(snapshot);
  }
  create(type, attrs) {
    return this.typeRef(type).push(attrs);
  }
  createModel(type, attrs) {
    let ref = this.create(type, attrs);
    return new Promise((resolve, reject) =>
      ref.once('value', snapshot => resolve(this.model(type, snapshot)), reject)
    );
  }
  findBy(type, child, value) {
    return this.typeRef(type).orderByChild(child).equalTo(value);
  }
}
