import React from 'react-native';
import Button from 'react-native-button';
import {Icon} from 'react-native-icons';
import TimerMixin from 'react-timer-mixin';
import PomoTimer from '../models/pomo-timer';
import Circle from './circle';
import Teams from './teams';
import Services from '../services';
import {
  TimerToggle
} from './mixins';
let {
  TouchableHighlight,
  View,
  Text,
} = React;

export default React.createClass({
  mixins: [TimerMixin, TimerToggle],
  getInitialState() {
    return {
      user: {},
      radius: 100
    };
  },
  componentWillMount() {
    this.currentUser = Services.get('currentUser');
    this.currentUser.addListener('value', user => this.setState({user}));
    this.setInterval(this.forceUpdate, 1000);
  },
  componentWillUnmount() {
    this.currentUser.removeAllListeners('value', this.currentUserChanged);
  },
  render() {
    let state = this.state;
    let diameter = state.radius * 2;
    let center = {x: state.radius, y: state.radius};
    let pomo = new PomoTimer(state.user.pomo);
    let timer = pomo.currentTimer;
    let progress = timer.elapsed / timer.duration;
    let status = timer.isRunning
        ? <Text style={styles.text}>{timer.minutesSeconds}</Text>
        : <Icon name='ion|play' color={textColor} size={iconSize} style={styles.paused} />;
    return (
      <View style={styles.container}>
        <View style={styles.center}>
          <TouchableHighlight
              activeOpacity={0.5} underlayColor='#fff'
              onPress={() => this.toggleTimer(pomo)}>
            <View style={styles.center}>
              <View style={{width: diameter, height: diameter}}>
                <Circle radius={this.state.radius} pomo={pomo} />
                <View style={styles.center}>
                  {status}
                </View>
              </View>
            </View>
          </TouchableHighlight>
        </View>
        <View style={styles.footer}>
          <Button style={styles.teamsButton} onPress={this.onTeamsPressed}>Teams</Button>
        </View>
      </View>
    );
  },
  onTeamsPressed() {
    this.currentUser.ref().then(userRef =>
      Services.get('nav').push(Teams, 'Teams', {
        userRef,
        teams: this.state.user.teams,
      })
    )
  }
});

let iconSize = 30;
let textColor = '#666';
let styles = React.StyleSheet.create({
  container: {
    marginTop: 65,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  center: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    color: textColor,
    margin: 10,
    textAlign: 'center',
  },
  paused: {
    width: iconSize,
    height: iconSize,
  },
  footer: {
    alignItems: 'center',
    padding: 10,
  },
  teamsButton: {
    fontSize: 20,
  },
});
