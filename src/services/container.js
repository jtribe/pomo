export class Container {
  constructor() {
    this.factories = {};
    this.instances = {};
  }
  define(name, klass, dependencies = []) {
    this.factories[name] = {klass, dependencies};
  }
  get(name) {
    var instance = this.instances[name];
    if (!instance) {
      instance = this.instances[name] = this.create(name);
    }
    return instance;
  }
  create(name) {
    if (!this.factories[name]) throw new Exception(`Unknown factory ${name} in call to Container.get`);
    let {klass, factory, dependencies} = this.factories[name];
    if (!factory) {
      let injections = dependencies.reduce((accum, dep) => {
        accum[dep] = this.get(dep);
        return accum;
      }, {});
      let injected = class extends klass {};
      Object.assign(injected.prototype, injections);
      factory = this.factories[name].factory = () => {
        return new injected();
      }
    }
    return factory();
  }
}

export default new Container();
