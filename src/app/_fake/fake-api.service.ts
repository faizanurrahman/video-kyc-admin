import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { UsersTable } from './users.table';

@Injectable({
  providedIn: 'root',
})
export class FakeAPIService implements InMemoryDbService {
  constructor() {}

  /**
   * Create Fake DB and API
   */
  createDb() {
    return {
      // auth module
      users: UsersTable.users,

      // loan module

      // report module
    };
  }
}
