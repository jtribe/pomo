import Services from './services';

export let TimerToggle = {
  toggleTimer() {
    var pomo = this.props.pomo;
    pomo.isRunning ? pomo.stop() : pomo.start();
    this.forceUpdate();
    return Services.get('currentUser').updatePomo(pomo);
  }
};
