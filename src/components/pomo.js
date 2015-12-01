import React from 'react-native';
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
    this.currentUser.onValue(user => () => this.setState({user}));
    this.setInterval(this.forceUpdate, 1000);
  },
  componentWillUnmount() {
    this.currentUser.removeValueListeners();
  },
  render() {
    let state = this.state;
    let diameter = state.radius * 2;
    let center = {x: state.radius, y: state.radius};
    let pomo = new PomoTimer(state.user.pomo);
    let timer = pomo.currentTimer;
    let progress = timer.elapsed / timer.duration;
    let text = timer.minutesSeconds;

    return (
      <View style={styles.view}>
        <TouchableHighlight onPress={() => this.toggleTimer(pomo)}>
          <View style={[{width: diameter}, styles.timer]}>
            <Circle radius={this.state.radius} pomo={pomo} />
            <Text height="100%" style={styles.text}>
              {text}
            </Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={styles.teamsButton} onPress={this.onTeamsPressed}>
          <Text style={styles.teamsButtonText}>Teams</Text>
        </TouchableHighlight>
      </View>
    );
  },
  onTeamsPressed() {
    this.currentUser.ref().then(userRef =>
      Services.get('nav').push(Teams, 'Teams', {userRef})
    )
  }
});

let styles = React.StyleSheet.create({
  view: {
    marginTop: 56,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  timer: {
    alignSelf: 'center',
    width: 200,
    height: 200,
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    color: '#666',
    margin: 10,
    textAlign: 'center',
  },
  teamsButton: {
    marginRight: 20,
    marginLeft: 20,
    marginTop: 50,
    borderRadius: 10,
    justifyContent: 'center',
  },
  teamsButtonText: {
    color: 'white',
    fontSize: 20,
    paddingTop: 15,
    paddingBottom: 15,
    alignSelf: 'flex-end',
    marginRight: 20,
  },
});
