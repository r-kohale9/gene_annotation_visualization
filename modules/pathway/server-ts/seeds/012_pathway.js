import { returnId, truncateTables } from '@gqlapp/database-server-ts';
import PATHWAYS from '../seed-data/012_pathway';

// eslint-disable-next-line import/prefer-default-export
export async function seed(knex, Promise) {
  await truncateTables(knex, Promise, ['pathway']);
  await Promise.all(
    PATHWAYS.map(async (ii, i) => {
      await returnId(knex('pathway')).insert(ii);
    })
  );
}
