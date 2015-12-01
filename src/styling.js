export default {
  pomoColor(pomo) {
    return pomo.isRunning
      ? pomo.isResting ? '#2196F3' : '#F44336'
      : '#333'
  }
};
