let React = require('react-native');
let {
  StyleSheet,
  Text,
  View,
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
    this.interval = setInterval(() => this.setState(), 1000);
  },
  render() {
    let timer = new TimerModel(this.props.user.timer);
    return (
      <View>
        <Text>{this.props.user.name}</Text>
        <Text>{timer.minutesSeconds}</Text>
      </View>
    )
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
});

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

