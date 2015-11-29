import Timer from '../src/models/timer';
import PomoTimer from '../src/models/pomo-timer';
import {expect} from 'chai';
import Rx from 'rx';

var pomo;
describe('PomoTimer model', () => {
  beforeEach(() => {
    pomo = new PomoTimer();
  });

  it('provides a timer that includes the rest time', () => {
    expect(pomo.status).to.equal('working');
    expect(pomo.isResting).to.equal(false, 'isResting');
    expect(pomo.timer.isRunning).to.equal(false, 'isRunning');
    expect(pomo.timer.elapsed).to.equal(0, 'elapsed');
    expect(pomo.timer.remaining).to.equal(pomo.duration, 'remaining');
    expect(pomo.currentTimer.elapsed).to.equal(0, 'currentTimer elapsed');
    expect(pomo.currentTimer.remaining).to.equal(pomo.pomoDuration, 'currentTimer remaining');
  });

  it('switches the rest timer after the pomo finishes', () => {
    pomo.timer.elapsed = pomo.pomoDuration;
    expect(pomo.status).to.equal('resting');
  });

  it('currentTimer models the working state', () => {
    expect(pomo.status).to.equal('working');
    expect(pomo.currentTimer.elapsed).to.equal(0);
    expect(pomo.currentTimer.remaining).to.equal(pomo.pomoDuration);
    expect(pomo.currentTimer.isRunning).to.equal(false);
    pomo.timer.start();
    expect(pomo.currentTimer.isRunning).to.equal(true);
  });

  it('currentTimer models the resting state', () => {
    pomo.timer.elapsed = pomo.pomoDuration;
    expect(pomo.status).to.equal('resting');
    expect(pomo.isResting).to.equal(true);
    expect(pomo.currentTimer.elapsed).to.equal(0, 'elapsed');
    expect(pomo.currentTimer.remaining).to.equal(pomo.restDuration, 'remaining');
    expect(pomo.currentTimer.isRunning).to.equal(false);
    pomo.timer.start();
    expect(pomo.currentTimer.isRunning).to.equal(true);
  });

  it('starts another pomodoro when it finishes', () => {
    pomo.timer.elapsed = pomo.duration;
    expect(pomo.status).to.equal('working');
    expect(pomo.currentTimer.elapsed).to.equal(0);
  });

  it('provides a state object', () => {
    expect(pomo.state).to.deep.equal({
      restDuration: PomoTimer.defaultRestDuration,
      timer: pomo.timer.state,
    });
  });

});
