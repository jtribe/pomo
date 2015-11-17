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
var state = require('./src/state');
var {
  Room
} = require('./src/components');

var PomoTimer = React.createClass({
  render() {
    return <Room room={state.room} users={state.users} />;
  }
});

AppRegistry.registerComponent('PomoTimer', () => PomoTimer);
