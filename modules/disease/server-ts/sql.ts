import { Model, raw } from 'objection';
import { camelizeKeys, decamelizeKeys, decamelize } from 'humps';
import { knex, returnId, orderedFor } from '@gqlapp/database-server-ts';
import { has } from 'lodash';

// Give the knex object to objection.
const eager = '[]';

Model.knex(knex);

export default class Disease extends Model {
  static get tableName() {
    return 'disease';
  }

  static get idColumn() {
    return 'id';
  }

  public async diseases(limit: number, after: any, orderBy: any, filter: any) {
    const queryBuilder = Disease.query()
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
          this.where('disease.is_active', filter.isActive);
        });
      }
      if (has(filter, 'searchText') && filter.searchText !== '') {
        queryBuilder
          .from('disease')
          .groupBy('disease.id')
          .where(function() {
            this.where(raw('LOWER(??) LIKE LOWER(?)', ['disease.title', `%${filter.searchText}%`])).orWhere(
              raw('LOWER(??) LIKE LOWER(?)', ['disease.description', `%${filter.searchText}%`])
            );
          });
      }
    }

    const allDiseaseItems = camelizeKeys(await queryBuilder);

    const total = allDiseaseItems.length;
    let res = {};

    if (limit && after) {
      res = camelizeKeys(
        await queryBuilder
          .limit(limit)
          .offset(after)
          .groupBy('disease.id')
      );
    } else if (limit && !after) {
      res = camelizeKeys(await queryBuilder.limit(limit).groupBy('disease.id'));
    } else if (!limit && after) {
      res = camelizeKeys(await queryBuilder.offset(after).groupBy('disease.id'));
    } else {
      res = camelizeKeys(await queryBuilder.groupBy('disease.id'));
    }
    return { diseaseItems: res, total };
  }
  public async disease(id: number) {
    // const res =
    return camelizeKeys(
      await Disease.query()
        .findById(id)
        .withGraphFetched(eager)
        .orderBy('id', 'desc')
    );
  }

  public async addDisease(params: any) {
    const res = await Disease.query().insertGraph(decamelizeKeys(params));
    return res;
  }

  public async editDisease(params: any) {
    const res = await Disease.query().upsertGraph(decamelizeKeys(params));
    return res;
  }

  public deleteDisease(id: number) {
    return knex('disease')
      .where('id', '=', id)
      .del();
  }
}
