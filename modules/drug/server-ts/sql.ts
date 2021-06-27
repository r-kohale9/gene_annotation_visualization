import { knex } from '@gqlapp/database-server-ts';

export default class Drug {
  public drugs() {
    return knex.select();
  }
}
