import React from 'react-native';
import ReactART from 'ReactNativeART';
import TimerMixin from 'react-timer-mixin';
import styling from '../styling';
let {
  Surface,
  Shape,
} = ReactART;

export default React.createClass({
  mixins: [TimerMixin],
  componentWillMount() {
    this.setState({radius: this.props.radius});
    let tick = () => {
      this.forceUpdate();
      this.requestAnimationFrame(tick);
    };
    tick();
  },
  render() {
    let strokeWidth = 3;
    let radius = this.props.radius;
    let arcRadius = radius - strokeWidth;
    let diameter = radius * 2;
    let center = {x: radius, y: radius};
    let circlePath = circle(center, arcRadius);

    let timer = this.props.pomo.currentTimer;
    let progress = timer.elapsed / timer.duration;
    let arcPath = progress ? arc(center, arcRadius, 0, progress * 360) : '';
    let arcColor = styling.pomoColor(this.props.pomo);

    return (
      <Surface width={diameter} height={diameter} style={styles.circle}>
        <Shape d={circlePath} stroke="#ccc" strokeWidth={strokeWidth} />
        <Shape d={arcPath} stroke={arcColor} strokeWidth={strokeWidth} />
      </Surface>
    );
  },
});

let styles = React.StyleSheet.create({
  circle: {
    position: 'absolute',
    top: 0,
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

