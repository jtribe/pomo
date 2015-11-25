import Timer from '../src/models/timer';
import {expect} from 'chai';
import Rx from 'rx';

var timer;
let delay = 100;

describe('Timer model', () => {
  beforeEach(() => {
    timer = new Timer();
  });

  it('is initially stopped', () => {
    expect(timer.isRunning).to.equal(false);
    expect(timer.elapsed).to.equal(0);
    expect(timer.remaining).to.equal(timer.duration);
  });
  it('can be started', () => {
    timer.start();
    expect(timer.isRunning).to.equal(true);
    return wait(1)
      .do(() => {
        expect(timer.elapsed).to.be.at.least(1);
        expect(timer.remaining).to.lessThan(timer.duration);
      })
      .toPromise();
  });
  it('can be stopped', () => {
    timer.start();
    timer.stop();
    expect(timer.isRunning).to.equal(false);
    timer.elapsed = delay;
    return wait(1)
      .do(() => {
        expect(timer.elapsed).to.equal(delay);
      })
      .toPromise();
  });
  it('can be started, stopped and re-started', () => {
    timer.start();
    return wait()
      .flatMap(() => {
        timer.stop();
        expect(timer.isRunning).to.equal(false);
        expect(timer.elapsed).to.be.at.least(delay);
        return wait();
      })
      .flatMap(() => {
        timer.start();
        return wait();
      })
      .do(() => {
        expect(timer.elapsed).to.be.at.least(delay * 2);
        expect(timer.elapsed).to.be.at.most(delay * 3);
      })
      .toPromise();
  });
  it('can be reset', () => {
    timer.start();
    timer.elapsed = delay;
    timer.reset();
    expect(timer.isRunning).to.equal(false);
    expect(timer.elapsed).to.equal(0);
  });
  it('provides a minutesSeconds property', () => {
    var checks = {
      0: '25:00',
      100: '25:00',
      1000: '24:59',
      59000: '24:01',
      60000: '24:00',
      600000: '15:00',
      1500000: '00:00',
      6000000: '00:00',
    };
    Object.keys(checks).forEach(millis => {
      timer.elapsed = millis;
      expect(timer.minutesSeconds).to.equal(checks[millis], `for ${millis}ms`);
    });
  });
});

function wait(millis = delay) {
  return Rx.Observable.timer(millis + 2); // add 2ms to avoid timing errors (ewww!)
}
