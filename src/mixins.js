expTimerToggle = {
  toggleTimer() {
    var timer = this.state.timer;
    timer.isRunning ? timer.stop() : timer.start();
    this.forceUpdate();
  }
};
