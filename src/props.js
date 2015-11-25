export default {
  room: {
    name: 'jtribe',
  },
  users: [
    {
      id: 1,
      name: 'Simon',
      timer: {
        isRunning: true,
        lastStarted: new Date(Date.now()),
        stoppedAfter: 55000,
        duration: 50000,
        restDuration: 10000,
      }
    },
    {
      id: 2,
      name: 'Mark',
      timer: {
        duration: 50000,
        restDuration: 10000,
      }
    }
  ]
};
