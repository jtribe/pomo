let React = require('react-native');
let {
  StyleSheet,
  Text,
  View,
  Dimensions,
  PixelRatio
} = React;
let TimerModel = require('./models/timer');

exports.App = React.createClass({
  render() {
    let props = this.props.props;
    return <Room room={props.room} users={props.users} />;
  }
});

let Room = React.createClass({
  render() {
    let users = this.props.users.map(user => <User user={user} key={user.id} />)
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
  componentDidMount: function() {
    this.interval = setInterval(() => this.forceUpdate(), 1000);
  },
  render() {
    let timer = new TimerModel(this.props.user.timer);
    return (
      <View style={styles.user}>
        <View style={styles.details}>
          <Text style={styles.name}>{this.props.user.name}</Text>
          <Text style={styles.remaining}>{timer.minutesSeconds}</Text>
        </View>
        <ProgressIndicator elapsed={timer.elapsed} duration={timer.duration} />
      </View>
    )
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
});

let ProgressIndicator = React.createClass({
  render() {
    let {elapsed, duration} = this.props;
    let width = Dimensions.get('window').width * (elapsed / duration);
    return (
      <View style={styles.outer}>
        <View style={[styles.inner, {width: width}]} />
      </View>
    );
  }
});

let styles = StyleSheet.create({
  title: {
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
  outer: {
    borderBottomWidth: 1 / PixelRatio.get(),
    borderColor: '#ccc',
  },
  inner: {
    backgroundColor: 'red',
    height: 2
  },
});
