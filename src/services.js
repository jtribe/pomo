import {Container} from './services/container';
import Db from './services/db';
import Store from './services/store';
import CurrentUser from './services/current-user';
import Teams from './services/teams';

export class Services extends Container {
  constructor() {
    super();
    this.define('db', Db);
    this.define('store', Store, ['db']);
    this.define('currentUser', CurrentUser, ['store']);
    this.define('teams', Teams, ['store', 'currentUser']);
  }
}

export default new Services();