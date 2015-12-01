/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import React from 'react-native';
import Pomo from './src/components/pomo';
import Team from './src/components/team';
import Services from './src/services';

let {
  View,
  NavigatorIOS,
  StyleSheet,
} = React;

let NavScreen = React.createClass({
  render: function () {
    let nav = Services.get('nav');
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{ title: "Pomo", component: Pomo }}
        //initialRoute={{title: 'Team', component: Team, passProps: {
        //  teamRef: Services.get('store').ref('team', 'jtribe')
        //}}}
        {...nav.navigatorProps}
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
