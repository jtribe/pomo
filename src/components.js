import React from 'react-native';
import PomoTimer from './models/pomo-timer';
import TimerMixin from 'react-timer-mixin';
import Circle from './circle';
import {
  TimerToggle
} from './mixins';
import props from './props';

let {
  StyleSheet,
  Text,
  View,
  Dimensions,
  PixelRatio,
  TouchableHighlight,
} = React;

exports.App = class App extends React.Component {
  componentWillMount() {
    this.setState(props);
  }
  render() {
    var timer = new PomoTimer({
      duration: 6000,
      restDuration: 2000,
    });
    timer.start();
    return <Circle timer={timer} />;
  }
  //render() {
  //  return <Room room={this.state.room} users={this.state.users} />;
  //}
};

class Room extends React.Component {
  render() {
    let users = this.props.users.map(
      user => <User user={user} key={user.id} />
    );
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          {this.props.room.name}
        </Text>
        {users}
      </View>
    )
  }
}

let User = React.createClass({
  mixins: [TimerMixin, TimerToggle],
  componentWillMount() {
    this.setState({timer: new PomoTimer(this.props.user.timer)});
    this.setInterval(() => this.tick(), 1000);
  },
  tick() {
    if (this.state.isFinished) {
      this.state.timer.stop();
    }
    this.forceUpdate()
  },
  render() {
    var timer = this.state.timer;
    return (
      <View style={styles.user}>
        <View style={styles.details}>
          <Text>{this.props.user.name}</Text>
          <TouchableHighlight onPress={() => this.toggleTimer()}>
            <Text>{timer.minutesSeconds}</Text>
          </TouchableHighlight>
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
