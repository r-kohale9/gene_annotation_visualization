import { returnId, truncateTables } from '@gqlapp/database-server-ts';
import GENES from '../seed-data/008_gene';

// eslint-disable-next-line import/prefer-default-export
export async function seed(knex, Promise) {
  await truncateTables(knex, Promise, ['gene']);
  await Promise.all(
    GENES.map(async (ii, i) => {
      await returnId(knex('gene')).insert(ii);
    })
  );
}
