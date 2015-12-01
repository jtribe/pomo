/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import React from 'react-native';
import Pomo from './src/components/pomo';
import Services from './src/services';

let {
  View,
  Navigator,
  StyleSheet,
} = React;

let NavScreen = React.createClass({
  render: function () {
    let nav = Services.get('nav');
    return (
      <Navigator
        style={styles.container}
        initialRoute={{component: Pomo}}
      />
    );
  }
});
React.AppRegistry.registerComponent('PomoTimer', () => NavScreen);

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
