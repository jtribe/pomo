var Timer = require('../src/models/timer');
var expect = require('chai').expect;
var Rx = require('rx');

var timer;
var delay = 100;
describe('Timer model', () => {
  beforeEach(() => {
    timer = new Timer();
  });

  it('is initially stopped', () => {
    expect(timer.isRunning).to.equal(false);
    expect(timer.elapsed).to.equal(0);
    expect(timer.remaining).to.equal(25 * 60000);
  });
  it('can be started', () => {
    timer.start();
    expect(timer.isRunning).to.equal(true);
    return wait()
      .do(() => {
        expect(timer.elapsed).to.be.at.least(delay);
        expect(timer.remaining).to.lessThan(Timer.defaultDuration);
      })
      .toPromise();
  });
  it('can be stopped', () => {
    timer.start();
    return wait()
      .do(() => {
        timer.stop();
        expect(timer.isRunning).to.equal(false);
        expect(timer.elapsed).to.be.at.least(delay);
      })
      .toPromise();
  });
  it('can be re-started', () => {
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
    return wait()
      .do(() => {
        expect(timer.elapsed).to.be.at.least(delay);
        timer.reset();
        expect(timer.elapsed).to.equal(0);
      })
      .toPromise();
  });
  it('provides a minutesSeconds property', () => {
    var checks = {
      0: '25:00',
      1000: '24:59',
      59000: '24:01',
      60000: '24:00',
      600000: '15:00',
      1500000: '00:00',
      6000000: '00:00',
    };
    Object.keys(checks).forEach(millis => {
      timer.elapsed = millis;
      expect(timer.minutesSeconds).to.equal(checks[millis]);
    });
  });
});

function wait(millis = delay) {
  return Rx.Observable.timer(millis + 2); // add 2ms to avoid timing errors (ewww!)
}
