import Services from './services';
import Button from 'react-native-button';
import ReactFireMixin from 'reactfire';
import React from 'react-native';
import {
  handleError
} from './utils';
let {
  StyleSheet,
  PropTypes,
  View,
  Text
} = React;

export default React.createClass({
  propTypes: {
    userRef: PropTypes.object
  },
  mixins: [ReactFireMixin],
  getInitialState() {
    return {teams: []};
  },
  componentWillMount() {
    this.store = Services.get('store');
    this.teams = Services.get('teams');
    this.bindAsArray(this.teams.forUser(this.props.userRef), 'teams');
  },
  render() {
    var teams = this.state.teams.map(team => <Text key={team['.key']}>{team['.key']}</Text>);
    return (
      <View style={styles.container}>
        <View style={styles.teams}>
          {teams}
        </View>
        <View style={styles.footer}>
          <Button onPress={this.joinTeam}>Join Team</Button>
        </View>
      </View>
    )
  },
  joinTeam() {
    var attrs = {name: 'jtribe'}; // ask the user for this
    this.teams.findOrCreateTeam(attrs)
      .then(teamRef => this.teams.join(teamRef))
      .catch(handleError);
  },
});

let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 20,
  },
  teams: {
    flex: 1,
  },
  footer: {
    alignItems: 'center',
  },
});
