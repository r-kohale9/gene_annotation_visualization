import { Model, raw } from 'objection';
import { camelizeKeys, decamelizeKeys, decamelize } from 'humps';
import { knex, returnId, orderedFor } from '@gqlapp/database-server-ts';
import { has } from 'lodash';
import Drug from '@gqlapp/drug-server-ts/sql';
import Cell from '@gqlapp/cell-server-ts/sql';
import Disease from '@gqlapp/disease-server-ts/sql';

// Give the knex object to objection.
const eager = '[drug_interactions, cell_specific_markers, disease_interactions]';

Model.knex(knex);

export default class Gene extends Model {
  static get tableName() {
    return 'gene';
  }

  static get idColumn() {
    return 'id';
  }

  static get relationMappings() {
    return {
      drug_interactions: {
        relation: Model.HasManyRelation,
        modelClass: Drug,
        join: {
          from: 'gene.gene_symbol',
          to: 'drug.gene_name'
        }
      },
      cell_specific_markers: {
        relation: Model.HasManyRelation,
        modelClass: Cell,
        join: {
          from: 'gene.gene_id',
          to: 'cell.gene_id'
        }
      },
      disease_interactions: {
        relation: Model.HasManyRelation,
        modelClass: Disease,
        join: {
          from: 'gene.gene_id',
          to: 'disease.gene_id'
        }
      }
    };
  }

  public async genes(limit: number, after: any, orderBy: any, filter: any) {
    const queryBuilder = Gene.query()
      // .withGraphFetched(eager)
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
          this.where('gene.is_active', filter.isActive);
        });
      }
      if (has(filter, 'geneId') && filter.geneId !== '') {
        queryBuilder.where(function() {
          this.where('gene.gene_id', filter.geneId);
        });
      }
      if (has(filter, 'geneSymbol') && filter.geneSymbol !== '') {
        queryBuilder.where(function() {
          this.where('gene.gene_symbol', filter.geneSymbol);
        });
      }
      if (has(filter, 'geneName') && filter.geneName !== '') {
        queryBuilder.where(function() {
          this.where('gene.gene_name', filter.geneName);
        });
      }
      if (has(filter, 'searchText') && filter.searchText !== '') {
        queryBuilder
          .from('gene')
          .groupBy('gene.id')
          .where(function() {
            this.where(raw('LOWER(??) LIKE LOWER(?)', ['gene.gene_symbol', `%${filter.searchText}%`])).orWhere(
              raw('LOWER(??) LIKE LOWER(?)', ['gene.gene_name', `%${filter.searchText}%`])
            );
          });
      }
    }

    const allGeneItems = camelizeKeys(await queryBuilder);

    const total = allGeneItems.length;
    let res = {};

    if (limit && after) {
      res = camelizeKeys(
        await queryBuilder
          .limit(limit)
          .offset(after)
          .groupBy('gene.id')
      );
    } else if (limit && !after) {
      res = camelizeKeys(await queryBuilder.limit(limit).groupBy('gene.id'));
    } else if (!limit && after) {
      res = camelizeKeys(await queryBuilder.offset(after).groupBy('gene.id'));
    } else {
      res = camelizeKeys(await queryBuilder.groupBy('gene.id'));
    }
    return { geneItems: res, total };
  }
  public async gene(id: number, geneId: number, geneSymbol: number) {
    let res = {};
    if (id) {
      res = camelizeKeys(
        await Gene.query()
          .findById(id)
          .withGraphFetched(eager)
          .orderBy('id', 'desc')
      );
    } else if (geneId) {
      res = camelizeKeys(
        await Gene.query()
          .withGraphFetched(eager)
          .where('gene_id', geneId)
          .orderBy('id', 'desc')
      )[0];
    } else if (geneSymbol) {
      res = camelizeKeys(
        await Gene.query()
          .withGraphFetched(eager)
          .where('gene_symbol', geneSymbol)
          .orderBy('id', 'desc')
      )[0];
    }
    return res;
  }

  public async addGene(params: any) {
    const res = await Gene.query().insertGraph(decamelizeKeys(params));
    return res;
  }

  public async editGene(params: any) {
    const res = await Gene.query().upsertGraph(decamelizeKeys(params));
    return res;
  }

  public deleteGene(id: number) {
    return knex('gene')
      .where('id', '=', id)
      .del();
  }
}
