import React from 'react-native';
import Services from '../services';
import Button from 'react-native-button';
import ReactFireMixin from 'reactfire';
import inflection from 'inflection';
import Team from './team';
import AddTeam from './add-team';

import {
  handleError,
} from '../utils';
import {
  Icon,
} from 'react-native-icons';
let {
  StyleSheet,
  PropTypes,
  View,
  Text,
  ListView,
  TouchableHighlight,
  Platform,
} = React;

export default React.createClass({
  propTypes: {
    userRef: PropTypes.object.isRequired,
    teams: PropTypes.object,
  },
  mixins: [ReactFireMixin],
  getInitialState() {
    return {
      teams: null
    };
  },
  componentWillMount() {
    let teams = Services.get('teams');
    if (this.props.teams) this.setState({teams: this.props.teams});
    this.bindAsArray(this.props.userRef.child('teams'), 'teams');
  },
  dataSource() {
    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    let store = Services.get('store');
    let refs = this.state.teams.map(team => store.ref('team', team['.key']));
    return ds.cloneWithRows(refs);
  },
  render() {
    let teams;
    if (this.state.teams) {
      teams = this.state.teams.length
        ? <ListView
            dataSource={this.dataSource()}
            renderRow={this.renderRow} />
        : <Text style={styles.loading}>You are not a member of any teams.</Text>;
    }
    else {
      teams = <Text style={styles.loading}>Loading...</Text>;
    }
    return (
      <View style={styles.container}>
        <View style={styles.teams}>
          {teams}
        </View>
        <View style={styles.footer}>
          <Button onPress={this.goToAddTeam}>Add Team</Button>
        </View>
      </View>
    )
  },
  renderRow(teamRef, sectionID, rowID) {
    return (
      <ListViewItem key={teamRef.key()} teamRef={teamRef} onTeamPress={this.goToTeam} />
    )
  },
  goToTeam(teamRef, team) {
    Services.get('currentUser').ref().then(currentUserRef =>
      Services.get('nav').push(Team, teamRef.key(), {
        teamRef, currentUserRef, team
      })
    );
  },
  goToAddTeam() {
    let currentUser = Services.get('currentUser');
    currentUser.attrs.then(user =>
      Services.get('nav').push(AddTeam, 'Add Team', {
        user,
        onComplete: this.onAddTeam
      })
    );
  },
  onAddTeam(teamName) {
    Services.get('nav').pop();
  },
});

let ListViewItem = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState() {
    return {
      team: {}
    };
  },
  componentWillMount() {
    this.bindAsObject(this.props.teamRef, 'team');
  },
  render() {
    let team = this.state.team;
    let details = 'Loading';
    let teamName = team.name || this.props.teamRef.key();
    if (team.members) {
      let numMembers = Object.keys(team.members).length;
      details = `${numMembers} ${inflection.inflect('member', numMembers)}`;
    }
    return (
      <TouchableHighlight onPress={this.onPress} underlayColor='#efefef'>
        <View style={styles.listItem}>
          <View>
            <Text style={styles.name}>{teamName}</Text>
            <Text style={styles.members}>{details}</Text>
          </View>
          <Icon name='ion|chevron-right' color='#ccc' size={iconSize} style={styles.disclosure} />
        </View>
      </TouchableHighlight>
    )
  },
  onPress() {
    this.props.onTeamPress(this.props.teamRef, this.state.team);
  },
});

let iconSize = 20;
let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  teams: {
    flex: 1,
  },
  loading: {
    marginTop: 65,
    padding: 10,
    color: '#666',
    fontSize: 15
  },
  listItem: {
    borderBottomWidth: 1 / React.PixelRatio.get(),
    borderColor: '#ccc',
    padding: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  members: {
    fontSize: 15,
    fontWeight: '100',
    color: 'black',
  },
  disclosure: {
    width: iconSize,
    height: iconSize,
    marginTop: 12,
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
    padding: 10,
  },
});
