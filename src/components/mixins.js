import Services from '../services';

export let TimerToggle = {
  toggleTimer(pomo) {
    if (!pomo) return;
    pomo.isRunning ? pomo.stop() : pomo.start();
    this.forceUpdate();
    return Services.get('currentUser').ref().then(
      ref => ref.update({pomo: pomo.state})
    );
  }
};
