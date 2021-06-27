import { returnId, truncateTables } from '@gqlapp/database-server-ts';
import CELL from '../seed-data/009_cell';

// eslint-disable-next-line import/prefer-default-export
export async function seed(knex, Promise) {
  await truncateTables(knex, Promise, ['cell']);
  await Promise.all(
    CELL.map(async (ii, i) => {
      await returnId(knex('cell')).insert(ii);
    })
  );
}
