import React from 'react-native';
import AudioPlayer from 'react-native-audioplayer';
import PomoTimer from '../models/pomo-timer';
let {
  Platform,
  VibrationIOS
} = React;
let {
  Notification: DeviceNotification,
} = React.NativeModules;

export default class Notification {
  constructor() {
    this.timeouts = [];
    this.intervals = [];
  }
  init() {
    this.currentUser.once('value',
      attrs => this.pomoChanged(new PomoTimer(attrs.pomo))
    );
  }
  pomoChanged(pomo) {
    this.clear();

    if (pomo.isRunning) {
      // set OS notifications for when the app's in the background
      let timeToRest = pomo.status == 'working'
          ? pomo.currentTimer.remaining
          : pomo.currentTimer.remaining + pomo.pomoDuration;
      DeviceNotification.notify(timeToRest, pomo.duration, 'Time to rest');
      let timeToWork = pomo.status == 'resting'
          ? pomo.currentTimer.remaining
          : pomo.currentTimer.remaining + pomo.restDuration;
      DeviceNotification.notify(timeToWork, pomo.duration, 'Time to work');

      // set timeouts and intervals to play the sound when the app's in the foreground
      this.timeouts.push(setTimeout(() => {
        notifyUser();
        this.intervals.push(setInterval(notifyUser, pomo.duration));
      }, timeToRest));
      this.timeouts.push(setTimeout(() => {
        notifyUser();
        this.intervals.push(setInterval(notifyUser, pomo.duration));
      }, timeToWork));
    }
  }
  clear() {
    DeviceNotification.clear();
    this.timeouts.map(clearTimeout);
    this.timeouts.length = 0;
    this.intervals.map(clearInterval);
    this.intervals.length = 0;
  }
};

let notifyUser = () => {
  if (Platform.OS == 'ios') VibrationIOS.vibrate();
  AudioPlayer.play('glass.wav');
};
