import React from 'react-native';
import Button from 'react-native-button';
import {Icon} from 'react-native-icons';
import TimerMixin from 'react-timer-mixin';
import PomoTimer from '../models/pomo-timer';
import Circle from './circle';
import Teams from './teams';
import Services from '../services';
import styling from '../styling';
let {
  TouchableHighlight,
  View,
  Text,
  Platform,
} = React;

export default React.createClass({
  mixins: [TimerMixin],
  getInitialState() {
    return {
      user: {},
      radius: 100
    };
  },
  componentWillMount() {
    this.currentUser = Services.get('currentUser');
    this.currentUser.addListener('value', user => this.setState({
      user,
      pomo: new PomoTimer(user.pomo)
    }));
    let tick = () => {
      this.forceUpdate();
      let remaining = this.state.pomo && this.state.pomo.currentTimer.remaining;
      this.setTimeout(tick, remaining ? remaining % 1000 : 1000);
    };
    tick();
  },
  componentWillUnmount() {
    this.currentUser.removeAllListeners('value', this.currentUserChanged);
  },
  render() {
    let state = this.state;
    let diameter = state.radius * 2;
    let center = {x: state.radius, y: state.radius};
    let pomo = state.pomo || new PomoTimer();
    let timer = pomo.currentTimer;
    let progress = timer.elapsed / timer.duration;
    let status = timer.isRunning || (Platform.OS === 'android') // icons not supported on Android (yet)
        ? <Text style={styles.text}>{timer.minutesSeconds}</Text>
        : <Icon name='ion|play' color={styling.blue} size={iconSize} style={styles.paused} />;
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
  toggleTimer(pomo) {
    if (!pomo) return;
    pomo.isRunning ? pomo.stop(true) : pomo.start();
    Services.get('notification').pomoChanged(pomo);
    this.forceUpdate();
    return Services.get('currentUser').ref().then(ref => {
      let pomoState = pomo.isRunning ? pomo.state : null;
      if (pomoState) {
        // durations that are not whole number factors of one hour will be weird because of
        // limitations of UILocalNotification on iOS. Simple solution: don't allow duration to be
        // changed from the default 30 mins
        delete pomoState.timer.duration;
      }
      ref.update({pomo: pomoState})
    });
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
    marginLeft: 3,
  },
  footer: {
    alignItems: 'center',
    padding: 10,
  },
  teamsButton: {
    fontSize: 20,
  },
});
