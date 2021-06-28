import { Model, raw } from 'objection';
import { camelizeKeys, decamelizeKeys, decamelize } from 'humps';
import { knex, returnId, orderedFor } from '@gqlapp/database-server-ts';
import { has } from 'lodash';

// Give the knex object to objection.
const eager = '[]';

Model.knex(knex);

export default class Drug extends Model {
  static get tableName() {
    return 'drug';
  }

  static get idColumn() {
    return 'id';
  }

  public async drugs(limit: number, after: any, orderBy: any, filter: any) {
    const queryBuilder = Drug.query()
      .withGraphFetched(eager)
      .orderBy('id', 'desc');
    if (orderBy && orderBy.column) {
      const column = orderBy.column;
      let order = 'asc';
      if (orderBy.order) {
        order = orderBy.order;
      }

      queryBuilder.orderBy(decamelize(column), order);
    }

    if (filter) {
      if (has(filter, 'isActive') && filter.isActive !== '') {
        queryBuilder.where(function() {
          this.where('drug.is_active', filter.isActive);
        });
      }
      if (has(filter, 'searchText') && filter.searchText !== '') {
        queryBuilder
          .from('drug')
          .groupBy('drug.id')
          .where(function() {
            this.where(raw('LOWER(??) LIKE LOWER(?)', ['drug.title', `%${filter.searchText}%`])).orWhere(
              raw('LOWER(??) LIKE LOWER(?)', ['drug.description', `%${filter.searchText}%`])
            );
          });
      }
    }

    const allDrugItems = camelizeKeys(await queryBuilder);

    const total = allDrugItems.length;
    let res = {};

    if (limit && after) {
      res = camelizeKeys(
        await queryBuilder
          .limit(limit)
          .offset(after)
          .groupBy('drug.id')
      );
    } else if (limit && !after) {
      res = camelizeKeys(await queryBuilder.limit(limit).groupBy('drug.id'));
    } else if (!limit && after) {
      res = camelizeKeys(await queryBuilder.offset(after).groupBy('drug.id'));
    } else {
      res = camelizeKeys(await queryBuilder.groupBy('drug.id'));
    }
    return { drugItems: res, total };
  }
  public async drug(id: number) {
    // const res =
    return camelizeKeys(
      await Drug.query()
        .findById(id)
        .withGraphFetched(eager)
        .orderBy('id', 'desc')
    );
  }

  public async addDrug(params: any) {
    const res = await Drug.query().insertGraph(decamelizeKeys(params));
    return res;
  }

  public async editDrug(params: any) {
    const res = await Drug.query().upsertGraph(decamelizeKeys(params));
    return res;
  }

  public deleteDrug(id: number) {
    return knex('drug')
      .where('id', '=', id)
      .del();
  }
}
