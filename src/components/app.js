import React from 'react-native';
import TimerMixin from 'react-timer-mixin';
import Circle from './circle';
import Teams from './teams';
import Team from './team';
import AddTeam from './add-team';
import Services from '../services';
let {
  View,
} = React;

export default React.createClass({
  getInitialState() {
    return {user: {}}
  },
  componentWillMount() {
    this.currentUser = Services.get('currentUser');
    this.currentUser.onValue(user => this.currentUserChanged(user));
  },
  currentUserChanged(user) {
    this.setState({user});
  },
  render() {
    return <Circle user={this.state.user} onPress={ () => {
        if (!this.currentUser.ref) return <View />;
        this.props.navigator.push({
          title: "Teams",
          component: Teams,
          passProps: {
            userRef: this.currentUser.ref,
            onPress: this.goToTeam,
          },
        });
    }} />;

    //return <AddTeam />;

    //let team = Services.get('store').ref('team', 'jtribe');
    //return <Team teamRef={team} />;
  },
  componentWillUnmount() {
    this.currentUser.off('value', this.currentUserChanged);
  },

  goToTeam(teamRef) {
    this.props.navigator.push({
      title: teamRef.key(),
      component: Team,
      passProps: {
        teamRef: teamRef
      },
    });
  },

});