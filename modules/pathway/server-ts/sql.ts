import { Model, raw } from 'objection';
import { camelizeKeys, decamelizeKeys, decamelize } from 'humps';
import { knex } from '@gqlapp/database-server-ts';
import { has } from 'lodash';

// Give the knex object to objection.
const eager = '[]';

Model.knex(knex);

export default class Pathway extends Model {
  static get tableName() {
    return 'pathway';
  }

  static get idColumn() {
    return 'id';
  }

  static get relationMappings() {
    return {};
  }

  public async pathways(limit: number, after: any, orderBy: any, filter: any) {
    const queryBuilder = Pathway.query()
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
          this.where('pathway.is_active', filter.isActive);
        });
      }
      if (has(filter, 'pathwayId') && filter.pathwayId !== '') {
        queryBuilder.where(function() {
          this.where('pathway.pathway_id', filter.pathwayId);
        });
      }
      if (has(filter, 'pathwaySymbol') && filter.pathwaySymbol !== '') {
        queryBuilder.where(function() {
          this.where('pathway.pathway_symbol', filter.pathwaySymbol);
        });
      }
      if (has(filter, 'pathwayName') && filter.pathwayName !== '') {
        queryBuilder.where(function() {
          this.where('pathway.pathway_name', filter.pathwayName);
        });
      }
      if (has(filter, 'searchText') && filter.searchText !== '') {
        queryBuilder
          .from('pathway')
          .groupBy('pathway.id')
          .where(function() {
            this.where(raw('LOWER(??) LIKE LOWER(?)', ['pathway.pathway_symbol', `%${filter.searchText}%`])).orWhere(
              raw('LOWER(??) LIKE LOWER(?)', ['pathway.pathway_name', `%${filter.searchText}%`])
            );
          });
      }
    }

    const allPathwayItems = camelizeKeys(await queryBuilder);

    const total = allPathwayItems.length;
    let res = {};

    if (limit && after) {
      res = camelizeKeys(
        await queryBuilder
          .limit(limit)
          .offset(after)
          .groupBy('pathway.id')
      );
    } else if (limit && !after) {
      res = camelizeKeys(await queryBuilder.limit(limit).groupBy('pathway.id'));
    } else if (!limit && after) {
      res = camelizeKeys(await queryBuilder.offset(after).groupBy('pathway.id'));
    } else {
      res = camelizeKeys(await queryBuilder.groupBy('pathway.id'));
    }
    return { pathwayItems: res, total };
  }
  public async pathway(id: number, pathwayId: number, pathwaySymbol: number) {
    let res = {};
    if (id) {
      res = camelizeKeys(
        await Pathway.query()
          .findById(id)
          .withGraphFetched(eager)
          .orderBy('id', 'desc')
      );
    } else if (pathwayId) {
      res = camelizeKeys(
        await Pathway.query()
          .withGraphFetched(eager)
          .where('pathway_id', pathwayId)
          .orderBy('id', 'desc')
      )[0];
    } else if (pathwaySymbol) {
      res = camelizeKeys(
        await Pathway.query()
          .withGraphFetched(eager)
          .where('pathway_symbol', pathwaySymbol)
          .orderBy('id', 'desc')
      )[0];
    }
    return res;
  }

  public async addPathway(params: any) {
    const res = await Pathway.query().insertGraph(decamelizeKeys(params));
    return res;
  }

  public async editPathway(params: any) {
    const res = await Pathway.query().upsertGraph(decamelizeKeys(params));
    return res;
  }

  public deletePathway(id: number) {
    return knex('pathway')
      .where('id', '=', id)
      .del();
  }
}
