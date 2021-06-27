import { returnId, truncateTables } from '@gqlapp/database-server-ts';
import DRUG from '../seed-data/010_drug';

// eslint-disable-next-line import/prefer-default-export
export async function seed(knex, Promise) {
  await truncateTables(knex, Promise, ['drug']);
  await Promise.all(
    DRUG.map(async (ii, i) => {
      await returnId(knex('drug')).insert(ii);
    })
  );
}
