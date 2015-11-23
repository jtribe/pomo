let React = require('react-native');
let {
  StyleSheet,
  Text,
  View,
  Dimensions,
  PixelRatio,
  TouchableHighlight,
} = React;
let TimerModel = require('./models/timer');
let TimerMixin = require('react-timer-mixin');
let Circle = require('./circle');
let TimerToggle = require('./mixins');

exports.App = class App extends React.Component {
  render() {
    var timer = new TimerModel({duration: 10000});
    timer.start();
    return <Circle timer={timer} />;
    //return <Room room={this.props.room} users={this.props.users} />;
  }
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
    this.setState({timer: new TimerModel(this.props.user.timer)});
    this.setInterval(() => this.tick(), 17);
  },
  tick() {
    var {timer} = this.state;
    if (timer.isFinished) {
      timer.stop();
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
    this.setInterval(() => this.forceUpdate(), 17);
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
