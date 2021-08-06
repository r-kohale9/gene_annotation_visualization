import { returnId, truncateTables } from '@gqlapp/database-server-ts';
import CELL from '../seed-data/009_cell';
import TISSUE from '../seed-data/013_tissue';

// eslint-disable-next-line import/prefer-default-export
export async function seed(knex, Promise) {
  await truncateTables(knex, Promise, ['cell', 'tissue']);
  await Promise.all(
    CELL.map(async (ii, i) => {
      await returnId(knex('cell')).insert(ii);
    })
  );
  await Promise.all(
    TISSUE.map(async (ii, i) => {
      await returnId(knex('tissue')).insert(ii);
    })
  );
}
