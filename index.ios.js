/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} = React;
var props = require('./src/props');
var {
  App
} = require('./src/components');

var PomoTimer = React.createClass({
  render() {
    return <App props={props} />;
  }
});

AppRegistry.registerComponent('PomoTimer', () => PomoTimer);
