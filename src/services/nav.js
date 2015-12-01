import React from 'react-native';

let {
    BackAndroid,
} = React;

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
      console.log(this.navigator.getCurrentRoutes());
      BackAndroid.addEventListener('hardwareBackPress', () => this.pop());
    }
  }
  renderScene(route, navigator) {
    return React.createElement(route.component, route.props);
  }
  pop() {
    if (this.navigator.getCurrentRoutes().length > 1) {
      this.navigator.pop();
      return true;
    }
  }
  get navigatorProps() {
    return {
      renderScene: this.renderScene.bind(this),
      ref: this.init.bind(this),
    };
  }
}
