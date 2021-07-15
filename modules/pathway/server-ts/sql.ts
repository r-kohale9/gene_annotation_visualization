import { knex } from '@gqlapp/database-server-ts';

export default class Pathway {
  public pathways() {
    return knex.select();
  }
}
