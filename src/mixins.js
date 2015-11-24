export var TimerToggle = {
  toggleTimer() {
    var timer = this.state.timer;
    if (timer.isFinished) {
      timer.reset();
    }
    timer.isRunning ? timer.stop() : timer.start();
    this.forceUpdate();
  }
};
