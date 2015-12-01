import React from 'react-native';
import Pomo from './src/components/pomo';
import Team from './src/components/team';
import Teams from './src/components/teams';
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
        initialRoute={{ title: 'Pomo', component: Pomo }}
        //initialRoute={{ title: 'jtribe', component: Team, passProps: {
        //  teamRef: Services.get('store').ref('team', 'jtribe'),
        //  currentUserRef: Services.get('store').ref('user', 'a2a25550-f7e0-42e2-a184-e249657984a1'),
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
