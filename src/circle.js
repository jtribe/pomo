let React = require('react-native');
let ReactART = require('ReactNativeART');
let {
  TouchableHighlight,
  View,
} = React;
let {
  Surface,
  Shape,
} = ReactART;
let {
  TimerToggle
} = require('./mixins');
var TimerMixin = require('react-timer-mixin');

module.exports = React.createClass({
  mixins: [TimerMixin, TimerToggle],
  componentWillMount() {
    this.setInterval(() => this.forceUpdate(), 17);
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
    let progress = state.timer.elapsed / state.timer.duration;
    let radius = state.radius - this.state.strokeWidth;
    let diameter = state.radius * 2;
    let center = {x: state.radius, y: state.radius};
    let circlePath = circle(center, radius);
    let arcPath = arc(center, radius, 0, progress * 360);

    return (
      <View style={styles.view}>
        <View style={[{width: diameter}, styles.circle]}>
          <TouchableHighlight onPress={() => this.toggleTimer()}>
            <View>
              <Surface width={diameter} height={diameter}>
                <Shape d={circlePath} stroke="#666" strokeWidth={state.strokeWidth} />
                <Shape d={arcPath} stroke="#FFEB3B" strokeWidth={state.strokeWidth} />
              </Surface>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
});

function circle(center, radius) {
  return `M ${center.x} ${center.y}
      m -${radius}, 0
      a ${radius},${radius} 0 1,0 ${radius * 2},0
      a ${radius},${radius} 0 1,0 -${radius * 2},0`;
}

function polarToCartesian(center, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
  return {
    x: center.x + (radius * Math.cos(angleInRadians)),
    y: center.y + (radius * Math.sin(angleInRadians))
  };
}

function arc(center, radius, startAngle, endAngle) {
  if ((endAngle - startAngle) >= 360) {
    return circle(center, radius);
  }
  var start = polarToCartesian(center, radius, endAngle);
  var end = polarToCartesian(center, radius, startAngle);
  var arcSweep = endAngle - startAngle <= 180 ? 0 : 1;
  return [
    "M", start.x, start.y,
    "A", radius, radius, 0, arcSweep, 0, end.x, end.y
  ].join(" ");
}

let styles = React.StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  circle: {
    alignSelf: 'center',
  },
});
