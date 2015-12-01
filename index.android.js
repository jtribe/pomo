/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import React from 'react-native';
import Pomo from './src/components/pomo';
import Services from './src/services';

let {
  Text,
  Navigator,
  StyleSheet,
  TouchableHighlight,
} = React;

var NavBarRouteMapper = {
  LeftButton: function(route, navigator, index, navState) {
      if (index > 0) {
        return (
            <TouchableHighlight style={styles.backButton} underlayColor="white" onPress={ () =>{
                navigator.pop();
              }}>
              <Text style={styles.buttonText}>&lt;</Text>
            </TouchableHighlight>
        );
      } else {
        return null;
      }
  },

  RightButton: function(route, navigator, index, navState) {
    return null;
  },

  Title: function(route, navigator, index, navState) {
    return (
        <Text style={styles.navTitle}>{route.title}</Text>
    );
  },

}

let NavScreen = React.createClass({
  render: function () {
    let nav = Services.get('nav');
    return (
      <Navigator
        style={styles.container}
        initialRoute={{title: "Pomo", component: Pomo}}
        navigationBar={
          <Navigator.NavigationBar
              routeMapper={NavBarRouteMapper}
              style={styles.navBar}
          />
        }
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
  buttonText: {
    color: 'black',
    fontSize: 30,
    marginLeft: 20,
    marginTop: 5,
    fontWeight: '900',
  },
  navTitle: {
    color: 'black',
    fontSize: 25,
    marginTop: 10,
    fontWeight: 'bold',
  },
  navBar: {
    backgroundColor: '#eee',
  },
});
