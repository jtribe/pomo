import React from 'react-native';
import TimerMixin from 'react-timer-mixin';
import Circle from './circle';
import Teams from './teams';
import {
  TimerToggle
} from './mixins';
import props from './props';
import Services from './services';

let {
  StyleSheet,
  Text,
  View,
  Dimensions,
  PixelRatio,
  TouchableHighlight,
} = React;

exports.App = class App extends React.Component {
  constructor() {
    super();
    this.state = {user: null};
    this.currentUser = Services.get('currentUser');
  }
  componentWillMount() {
    this.currentUser.onValue(user => this.currentUserChanged(user));
  }
  currentUserChanged(user) {
    this.setState({user});
  }
  render() {
    return <Circle user={this.state.user} />;

    //let room = Services.get('store').ref('room', 'jtribe');
    //return <Room room={room} />;

    //if (!this.currentUser.ref) return <View />;
    //return <Teams userRef={this.currentUser.ref} />;
  }
  componentWillUnmount() {
    this.currentUser.off('value', this.currentUserChanged);
  }
};

let Room = React.createClass({
  mixins: [TimerMixin],
  componentWillMount() {
    this.setInterval(() => this.forceUpdate(), 1000);
  },
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
});

let User = React.createClass({
  mixins: [TimerToggle],
  componentWillMount() {
    this.setProps({pomo: new PomoTimer(this.props.user.pomo)});
  },
  render() {
    var pomo = this.props.pomo;
    var timer = pomo.currentTimer;
    return (
      <View style={styles.user}>
        <View style={styles.details}>
          <Text>{this.props.user.name}</Text>
          <TouchableHighlight onPress={() => this.toggleTimer(pomo)}>
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
