import React from 'react-native';
import TimerMixin from 'react-timer-mixin';
import PomoTimer from '../models/pomo-timer';
import styling from '../styling';

let {
  PropTypes,
  StyleSheet,
  Text,
  View,
  Dimensions,
  PixelRatio,
} = React;

export default ProgressIndicator = React.createClass({
  propTypes: {
    pomo: PropTypes.instanceOf(PomoTimer).isRequired,
  },
  mixins: [TimerMixin],
  componentDidMount() {
    let tick = () => {
      this.forceUpdate();
      this.requestAnimationFrame(tick);
    };
    tick();
  },
  render() {
    let timer = this.props.pomo.currentTimer;
    let width = Dimensions.get('window').width * (timer.elapsed / timer.duration);
    let color = styling.pomoColor(this.props.pomo);
    return (
      <View style={styles.outer}>
        <View style={[styles.inner, {backgroundColor: color, width}]} />
      </View>
    );
  }
});

let onePx = 1 / PixelRatio.get();
let styles = StyleSheet.create({
  outer: {
    borderBottomWidth: onePx,
    borderColor: '#ccc',
  },
  inner: {
    height: 2,
    marginBottom: 0 - onePx,
  },
});
