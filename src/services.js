import {Container} from './services/container';
import Db from './services/db';
import CurrentUser from './services/current-user';

export class Services extends Container {
  constructor() {
    super();
    this.define('db', Db);
    this.define('currentUser', CurrentUser, ['db']);
  }
}

export default new Services();
