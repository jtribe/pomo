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
  ScrollView,
  View,
  Text,
  TextInput,
  Platform,
} = React;
let Form = tcomb.form.Form;

var Team = tcomb.struct({
  name: tcomb.String,
  userName: tcomb.String,
});

export default React.createClass({
  propTypes: {
    user: PropTypes.object.isRequired
  },
  mixins: [ReactFireMixin],
  getInitialState() {
    return {
      value: {},
    };
  },
  componentWillMount() {
    this.setState({
      value: {
        userName: this.props.user.name
      }
    });
  },
  render() {
    let options = {
      fields: {
        name: {
          label: 'Team Name',
        },
        userName: {
          label: 'Your Name',
        }
      }
    };
    return (
      <View style={styles.container}>
        <View style={styles.form}>
          <Form
            ref='form'
            value={this.state.value}
            type={Team}
            onChange={this.onChange}
            options={options}
          />
        </View>
        <View style={styles.footer}>
          <Button styles={styles.button} onPress={this.addTeam} underlayColor='#99d9f4'>
            Add Team
          </Button>
        </View>
      </View>
    )
  },
  addTeam() {
    var values = this.refs.form.getValue();
    if (values) {
      let currentUser = Services.get('currentUser');
      let teams = Services.get('teams');
      teams.findOrCreateTeam({name: values.name})
        .then(teamRef => teams.join(teamRef, {name: values.userName}))
        .then(() => currentUser.ref())
        .then(userRef => userRef.update({name: values.userName}))
        .then(() => this.props.onComplete())
        .catch(handleError);
    }
  },
});

let styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 66 : 56,
    padding: 10,
  },
  form: {
  },
  footer: {
    alignItems: 'center',
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
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
