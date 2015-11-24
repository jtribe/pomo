import React from 'react-native';
import ReactART from 'ReactNativeART';
import TimerMixin from 'react-timer-mixin';
import {
  TimerToggle
} from './mixins';
let {
  TouchableHighlight,
  View,
  Text,
} = React;
let {
  Surface,
  Shape,
} = ReactART;

export default React.createClass({
  mixins: [TimerMixin, TimerToggle],
  componentWillMount() {
    let tick = () => {
      this.forceUpdate();
      this.requestAnimationFrame(tick);
    };
    tick();
    this.setState({timer: this.props.timer});
  },
  getInitialState() {
    let radius = 100;
    return {
      strokeWidth: 2,
      radius: radius,
      timer: null
    }
  },
  render() {
    let state = this.state;
    let timer = state.timer;
    let progress = timer.elapsed / timer.duration;
    let radius = state.radius - this.state.strokeWidth;
    let diameter = state.radius * 2;
    let center = {x: state.radius, y: state.radius};
    let circlePath = circle(center, radius);
    let arcPath = arc(center, radius, 0, progress * 360);

    return (
      <View style={styles.view}>
        <TouchableHighlight onPress={() => this.toggleTimer()}>
          <View style={[{width: diameter}, styles.timer]}>
            <Surface width={diameter} height={diameter} style={styles.circle}>
              <Shape d={circlePath} stroke="#666" strokeWidth={state.strokeWidth} />
              <Shape d={arcPath} stroke="#FFEB3B" strokeWidth={state.strokeWidth} />
            </Surface>
            <Text height="100%" style={styles.text}>
              {timer.isFinished ? 'Rest' : timer.minutesSeconds}
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
});

let styles = React.StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  timer: {
    alignSelf: 'center',
    width: 200,
    height: 200,
    flex: 1,
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
    top: 0,
  },
  text: {
    fontSize: 20,
    color: '#666',
    margin: 10,
    textAlign: 'center',
  },
});

function circle(center, radius) {
  return `M ${center.x} ${center.y}
      m -${radius}, 0
      a ${radius},${radius} 0 1,0 ${radius * 2},0
      a ${radius},${radius} 0 1,0 -${radius * 2},0`;
}

function arc(center, radius, startAngle, endAngle) {
  if ((endAngle - startAngle) >= 360) {
    return circle(center, radius);
  }
  var start = polarToCartesian(center, radius, endAngle);
  var end = polarToCartesian(center, radius, startAngle);
  var arcSweep = endAngle - startAngle <= 180 ? 0 : 1;
  return [
    'M', start.x, start.y,
    'A', radius, radius, 0, arcSweep, 0, end.x, end.y
  ].join(' ');
}

function polarToCartesian(center, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
  return {
    x: center.x + (radius * Math.cos(angleInRadians)),
    y: center.y + (radius * Math.sin(angleInRadians))
  };
}

