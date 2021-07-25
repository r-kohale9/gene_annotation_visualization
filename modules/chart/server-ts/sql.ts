import { knex } from '@gqlapp/database-server-ts';

export default class Chart {
  public charts() {
    return knex.select();
  }
}
