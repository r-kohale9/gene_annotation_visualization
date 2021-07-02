import { returnId, truncateTables } from '@gqlapp/database-server-ts';
import DISEASES from '../seed-data/011_disease';

// eslint-disable-next-line import/prefer-default-export
export async function seed(knex, Promise) {
  await truncateTables(knex, Promise, ['disease']);
  await Promise.all(
    DISEASES.map(async (ii, i) => {
      await returnId(knex('disease')).insert(ii);
    })
  );
}
