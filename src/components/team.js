import React from 'react-native';
import TimerMixin from 'react-timer-mixin';
import ReactFireMixin from 'reactfire';
import Services from '../services';
import PomoTimer from '../models/pomo-timer';
import {
  TimerToggle
} from './mixins';

let {
  StyleSheet,
  Text,
  View,
  Dimensions,
  PixelRatio,
  TouchableHighlight,
} = React;

export default React.createClass({
  mixins: [TimerMixin, ReactFireMixin],
  getInitialState() {
    return {
      team: {
        members: [],
      },
    };
  },
  componentWillMount() {
    this.store = Services.get('store');
    this.setInterval(() => this.forceUpdate(), 1000);
    this.bindAsObject(this.props.teamRef, 'team');
  },
  render() {
    let users = Object.keys(this.state.team.members).map(id => {
      return <User userRef={this.store.ref('user', id)} key={id} />;
    });
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          {this.state.team.name}
        </Text>
        {users}
      </View>
    )
  }
});

let User = React.createClass({
  mixins: [TimerToggle, ReactFireMixin],
  getInitialState() {
    return {
      user: {}
    };
  },
  componentWillMount() {
    this.bindAsObject(this.props.userRef, 'user');
  },
  render() {
    let pomo = new PomoTimer(this.state.user.pomo);
    let timer = pomo.currentTimer;
    return (
      <View style={styles.user}>
        <View style={styles.details}>
          <Text>{this.state.user.name}</Text>
          <Text>{timer.minutesSeconds}</Text>
        </View>
        <ProgressIndicator timer={timer} />
      </View>
    )
  },
});

let ProgressIndicator = React.createClass({
  mixins: [TimerMixin],
  componentDidMount() {
    let tick = () => {
      this.forceUpdate();
      this.requestAnimationFrame(tick);
    };
    tick();
  },
  render() {
    var {timer} = this.props;
    let width = Dimensions.get('window').width * (timer.elapsed / timer.duration);
    return (
      <View style={styles.outer}>
        <View style={[styles.inner, timer.isRunning && styles.running, {width: width}]} />
      </View>
    );
  }
});

let onePx = 1 / PixelRatio.get();
let styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  user: {
    marginBottom: 5,
  },
  details: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    marginBottom: 5,
  },
  debug: {
    borderWidth: 1,
    borderColor: 'red'
  },
  outer: {
    borderBottomWidth: onePx,
    borderColor: '#ccc',
  },
  inner: {
    backgroundColor: '#ccc',
    height: 2,
    marginBottom: 0 - onePx,
  },
  running: {
    backgroundColor: 'red',
  }
});
