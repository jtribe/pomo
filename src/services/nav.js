import React from 'react-native';

export default class Nav {
  init(navigator) {
    this.navigator = navigator;
    this.ios = !(navigator instanceof React.Navigator);
  }
  push(component, title, props) {
    if (this.ios) {
      this.navigator.push({
        title,
        component,
        passProps: props,
      });
    }
    else {
      this.navigator.push({
        title,
        component,
        props
      });
    }
  }
  renderScene(route, navigator) {
    return React.createElement(route.component, route.props);
  }
  pop() {
    this.navigator.pop();
  }
  get navigatorProps() {
    return {
      renderScene: this.renderScene.bind(this),
      ref: this.init.bind(this),
    };
  }
}
