import React from 'react-native';
import TimerMixin from 'react-timer-mixin';
import Circle from './circle';

export default React.createClass({
  render() {
    return <Circle navigator={this.props.navigator} />;
  },
});
