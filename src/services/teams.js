export default class Teams {
  forUser(userRef) {
    return userRef.child('teams');
  }
  findOrCreateTeam(attrs) {
    return new Promise((resolve, reject) => {
      var ref = this.store.ref('team', attrs.name);
      // perform the check for existence and creation in a transaction
      ref.transaction(
        team => {
          if (!team) { // if the team doesn't exist
            return attrs; // create it
          }
        }, (err, committed, snapshot) => {
          if (err) {
            reject(err);
          }
          else if (committed) {
            resolve(snapshot.ref());
          }
          else { // the team already existed
            resolve(ref);
          }
        }
      );
    });
  }
  join(teamRef, options) {
    return this.setIsMember(teamRef, true, options);
  }
  setIsMember(teamRef, bool, options) {
    let attrs = {
      name: options.name
    };
    return this.currentUser.ref().then(userRef =>
      // add the user to team/members
      new Promise((resolve, reject) => {
          teamRef.child(`members/${userRef.key()}`).set(bool ? attrs : null,
            err => err ? reject(err) : resolve()
          )
        })
        // add the team to user/teams (eww! should be in a transaction)
        .then(() => new Promise((resolve, reject) => {
          userRef.child(`teams/${teamRef.key()}`).set(bool || null,
            err => err ? reject(err) : resolve()
          )
        }))
    );
  }
}
