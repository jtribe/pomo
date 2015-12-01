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
} = React;

export default React.createClass({
  propTypes: {
    userRef: PropTypes.object
  },
  mixins: [ReactFireMixin],
  getInitialState() {
    return {
      teams: []
    };
  },
  componentWillMount() {
    let teams = Services.get('teams');
    this.bindAsArray(teams.forUser(this.props.userRef), 'teams');
    //this.state.teams = [
    //  {'.key': 'jtribe'},
    //  {'.key': 'foo'},
    //  {'.key': 'barbaz'},
    //];
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
    return (
      <View style={styles.container}>
        <ListView style={styles.teams}
          dataSource={this.dataSource()}
          renderRow={this.renderRow}
        />
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
  goToTeam(teamRef) {
    this.props.navigator.push({
      title: teamRef.key(),
      component: Team,
      passProps: {
        teamRef: teamRef
      },
    });
  },
  goToAddTeam() {
    this.props.navigator.push({
      title: 'Add Team',
      component: AddTeam,
      passProps: {
        onComplete: this.onCompleteAddTeam
      },
    });
  },
  onCompleteAddTeam(teamName) {
    this.props.navigator.pop();
  },
});

let ListViewItem = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState() {
    return {
      team: {
        members: []
      }
    };
  },
  componentWillMount() {
    this.bindAsObject(this.props.teamRef, 'team');
    //this.state.team = {
    //  name: this.props.teamRef.key(),
    //  members: Array(this.props.teamRef.key().length)
    //};
  },
  render() {
    let team = this.state.team;
    let numMembers = Object.keys(team.members).length;
    return (
      <TouchableHighlight onPress={() => this.props.onTeamPress(this.props.teamRef) } underlayColor='#efefef'>
        <View style={styles.listItem}>
          <View>
            <Text style={styles.name}>{team.name}</Text>
            <Text style={styles.members}>
              {`${numMembers} ${inflection.inflect('member', numMembers)}`}
            </Text>
          </View>
          <Icon name='ion|chevron-right' color='#ccc' size={iconSize} style={styles.disclosure} />
        </View>
      </TouchableHighlight>
    )
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
  },
  members: {
    fontSize: 15,
    fontWeight: '100',
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
    marginBottom: 20,
  },
});
