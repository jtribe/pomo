import React from 'react-native';
import TimerMixin from 'react-timer-mixin';
import ReactFireMixin from 'reactfire';
import Services from '../services';
import Timer from '../models/timer';
import PomoTimer from '../models/pomo-timer';
import ProgressIndicator from './progress-indicator';

let {
  PropTypes,
  StyleSheet,
  Text,
  View,
  Dimensions,
  PixelRatio,
  TouchableHighlight,
  Platform,
} = React;

export default React.createClass({
  propTypes: {
    teamRef: PropTypes.object.isRequired,
    currentUserRef: PropTypes.object.isRequired,
  },
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
    if (this.props.team) this.setState({team: this.props.team});
    this.bindAsObject(this.props.teamRef, 'team');
  },
  render() {
    let currentUserId = this.props.currentUserRef.key();
    let users = Object.keys(this.state.team.members)
      .sort((a, b) => (a != currentUserId) || (b == currentUserId))
      .map(id => {
        let {name} = this.state.team.members[id];
        let ref = this.store.ref('user', id);
        return (
          <User name={name} userRef={ref} key={id} isCurrentUser={id === currentUserId}/>
        );
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
  propTypes: {
    userRef: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
  },
  mixins: [ReactFireMixin],
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
          <Text style={styles.user}>{this.props.name}</Text>
          <Text style={styles.minutesSeconds}>{timer.minutesSeconds}</Text>
        </View>
        <ProgressIndicator pomo={pomo} />
      </View>
    )
  },
});

let styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 28 : 20,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
  },
  details: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 5,
    marginVertical: 12,
  },
  user: {
    fontSize: 18,
  },
  minutesSeconds: {
    fontSize: 15,
  }
});
