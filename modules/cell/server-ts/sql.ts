import { Model, raw } from 'objection';
import { camelizeKeys, decamelizeKeys, decamelize } from 'humps';
import { knex, returnId, orderedFor } from '@gqlapp/database-server-ts';
import { has } from 'lodash';

// Give the knex object to objection.
const eager = '[]';

Model.knex(knex);

export default class Cell extends Model {
  static get tableName() {
    return 'cell';
  }

  static get idColumn() {
    return 'id';
  }

  public async cells(limit: number, after: any, orderBy: any, filter: any) {
    const queryBuilder = Cell.query()
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
          this.where('cell.is_active', filter.isActive);
        });
      }
      if (has(filter, 'searchText') && filter.searchText !== '') {
        queryBuilder
          .from('cell')
          .groupBy('cell.id')
          .where(function() {
            this.where(raw('LOWER(??) LIKE LOWER(?)', ['cell.title', `%${filter.searchText}%`])).orWhere(
              raw('LOWER(??) LIKE LOWER(?)', ['cell.description', `%${filter.searchText}%`])
            );
          });
      }
    }

    const allCellItems = camelizeKeys(await queryBuilder);

    const total = allCellItems.length;
    let res = {};

    if (limit && after) {
      res = camelizeKeys(
        await queryBuilder
          .limit(limit)
          .offset(after)
          .groupBy('cell.id')
      );
    } else if (limit && !after) {
      res = camelizeKeys(await queryBuilder.limit(limit).groupBy('cell.id'));
    } else if (!limit && after) {
      res = camelizeKeys(await queryBuilder.offset(after).groupBy('cell.id'));
    } else {
      res = camelizeKeys(await queryBuilder.groupBy('cell.id'));
    }
    return { cellItems: res, total };
  }
  public async cell(id: number) {
    // const res =
    return camelizeKeys(
      await Cell.query()
        .findById(id)
        .withGraphFetched(eager)
        .orderBy('id', 'desc')
    );
  }

  public async addCell(params: any) {
    const res = await Cell.query().insertGraph(decamelizeKeys(params));
    return res;
  }

  public async editCell(params: any) {
    const res = await Cell.query().upsertGraph(decamelizeKeys(params));
    return res;
  }

  public deleteCell(id: number) {
    return knex('cell')
      .where('id', '=', id)
      .del();
  }
}
