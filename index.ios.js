/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import React from 'react-native';
import App from './src/components/app';
let {
    View,
    NavigatorIOS,
    StyleSheet,
  } = React;

var NavScreen = React.createClass({
  render: function () {
    return (
        <NavigatorIOS style={styles.container} initialRoute={{ title: "Pomo", component: App }} />
    );
  }
});

React.AppRegistry.registerComponent('PomoTimer', () => NavScreen);

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
