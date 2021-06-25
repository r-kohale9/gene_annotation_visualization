import { knex } from '@gqlapp/database-server-ts';

export default class Cell {
  public cells() {
    return knex.select();
  }
}
