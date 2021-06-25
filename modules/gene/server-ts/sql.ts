import { knex } from '@gqlapp/database-server-ts';

export default class Gene {
  public genes() {
    return knex.select();
  }
}
