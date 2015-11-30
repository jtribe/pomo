import React from 'react-native';
import ReactART from 'ReactNativeART';
import TimerMixin from 'react-timer-mixin';
import PomoTimer from '../models/pomo-timer';
import Teams from './teams';
import Services from '../services';
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
  getInitialState() {
    let radius = 100;
    return {
      strokeWidth: 2,
      radius: radius
    }
  },
  componentWillMount() {
    this.currentUser = Services.get('currentUser');
    this.currentUser.onValue(user => this.setState({user}));
    let tick = () => {
      this.forceUpdate();
      this.requestAnimationFrame(tick);
    };
    tick();
  },
  componentWillUnmount() {
    this.currentUser.off('value', this.currentUserChanged);
  },
  render() {
    let state = this.state;
    let radius = state.radius - state.strokeWidth;
    let diameter = state.radius * 2;
    let center = {x: state.radius, y: state.radius};
    let circlePath = circle(center, radius);
    var text = '';
    var arcPath, arcColor;
    var pomo;

    if (this.state.user) {
      pomo = new PomoTimer(this.state.user.pomo);
      let timer = pomo.currentTimer;
      let progress = timer.elapsed / timer.duration;
      arcPath = arc(center, radius, 0, progress * 360);
      arcColor = pomo.isResting ? '#9E9E9E' : '#FFEB3B';
      text = timer.minutesSeconds;
    }

    return (
      <View style={styles.view}>
        <TouchableHighlight onPress={() => this.toggleTimer(pomo)}>
          <View style={[{width: diameter}, styles.timer]}>
            <Surface width={diameter} height={diameter} style={styles.circle}>
              <Shape d={circlePath} stroke="#666" strokeWidth={state.strokeWidth} />
              <Shape d={arcPath} stroke={arcColor} strokeWidth={state.strokeWidth} />
            </Surface>
            <Text height="100%" style={styles.text}>
              {text}
            </Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={styles.teamsButton} onPress={this.onTeamsPressed}>
          <Text style={styles.teamsButtonText}>Teams</Text>
        </TouchableHighlight>
      </View>
    );
  },
  onTeamsPressed() {
    this.currentUser.getRef().then(userRef =>
      this.props.navigator.push({
        title: 'Teams',
        component: Teams,
        passProps: {
          userRef: userRef,
          navigator: this.props.navigator,
        },
      })
    )
  }
});

let styles = React.StyleSheet.create({
  view: {
    marginTop: 65,
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
  teamsButton: {
    marginRight: 20,
    marginLeft: 20,
    marginTop: 50,
    borderRadius: 10,
    justifyContent: 'center',
  },
  teamsButtonText: {
    color: 'white',
    fontSize: 20,
    paddingTop: 15,
    paddingBottom: 15,
    alignSelf: 'flex-end',
    marginRight: 20,
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

