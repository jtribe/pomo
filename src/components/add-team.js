import React from 'react-native';
import Services from '../services';
import Button from 'react-native-button';
import ReactFireMixin from 'reactfire';
import tcomb from 'tcomb-form-native';

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
  TextInput,
  Platform,
} = React;
let Form = tcomb.form.Form;

var Team = tcomb.struct({
  name: tcomb.String,
  user: tcomb.String,
});

export default React.createClass({
  mixins: [ReactFireMixin],
  getInitialState() {
    return {
      name: '',
      user: '',
    };
  },
  onChange(value) {
    this.setState({value});
  },
  componentWillMount() {
    this.setState({value: {user: this.props.user.name}});
  },
  render() {
    let options = {
      fields: {
        name: {
          label: 'Team Name',
        },
        user: {
          label: 'Your Name',
        }
      }
    };
    return (
      <View style={styles.container}>
        <Form
          ref="form"
          value={this.state.value}
          type={Team}
          onChange={this.onChange}
          options={options}
        />
        <View style={styles.footer}>
          <Button styles={styles.button} onPress={this.addTeam} underlayColor='#99d9f4'>
            Add Team
          </Button>
        </View>
      </View>
    )
  },
  addTeam() {
    var attrs = this.refs.form.getValue();
    if (attrs) {
      let currentUser = Services.get('currentUser');
      let teams = Services.get('teams');
      teams.findOrCreateTeam({name: attrs.name})
        .then(teamRef => teams.join(teamRef, {name: attrs.user}))
        .then(() => currentUser.ref())
        .then(userRef => userRef.update({name: attrs.user}))
        .then(() => this.props.onComplete())
        .catch(handleError);
    }
  },
});

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: Platform.OS === 'ios' ? 66 : 56,
    padding: 10,
  },
  form: {
    flex: 1,
  },
  footer: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    padding: 10,
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
});

styles.form = StyleSheet.create({
  control: {},
  label: {},
  input: {
    borderWidth: 1,
    height: 20,
  },
});
