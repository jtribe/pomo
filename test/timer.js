var Timer = require('../src/timer');
var expect = require('chai').expect;
var Rx = require('rx');

var timer;
var delay = 10;
describe('Timer model', function() {
  beforeEach(() => {
    timer = new Timer();
  });

  it('is initially stopped', function () {
    expect(timer.isRunning).to.equal(false);
    expect(timer.elapsed).to.equal(0);
    expect(timer.remaining).to.equal(25 * 60000);
  });
  it('can be started', function () {
    timer.start();
    expect(timer.isRunning).to.equal(true);
    return wait()
      .map(() => {
        expect(timer.elapsed).to.be.greaterThan(delay);
        expect(timer.remaining).to.lessThan(Timer.defaultDuration);
      })
      .toPromise();
  });
  it('can be stopped', function () {
    timer.start();
    return wait()
      .map(() => {
        timer.stop();
        expect(timer.isRunning).to.equal(false);
        expect(timer.elapsed).to.be.at.least(delay);
      })
      .toPromise();
  });
  it('can be re-started', function () {
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
      .map(() => {
        expect(timer.elapsed).to.be.at.least(delay * 2);
        expect(timer.elapsed).to.be.lessThan(delay * 3);
      })
      .toPromise();
  });
  it('can be reset', function () {
    timer.start();
    return wait()
      .map(() => {
        expect(timer.elapsed).to.be.greaterThan(delay);
        timer.reset();
        expect(timer.elapsed).to.equal(0);
      })
      .toPromise();
  });
});

function wait(millis = delay) {
  return Rx.Observable.timer(millis);
}
