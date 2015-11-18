module.exports = {
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
        stoppedAt: 600000,
      }
    },
    {
      id: 2,
      name: 'Mark',
      timer: {}
    }
  ]
};
