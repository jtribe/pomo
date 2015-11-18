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
        elapsedBeforeStop: 0,
      }
    },
    {
      id: 2,
      name: 'Mark',
      timer: {}
    }
  ]
};
