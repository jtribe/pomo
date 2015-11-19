/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var props = require('./src/props');
var {
  App
} = require('./src/components');

React.AppRegistry.registerComponent('PomoTimer', () => class extends React.Component {
  render() {
    return <App {...props} />;
  }
});
