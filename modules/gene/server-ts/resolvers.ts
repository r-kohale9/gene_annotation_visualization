import withAuth from 'graphql-auth';
import { withFilter } from 'graphql-subscriptions';

const GENE_SUBSCRIPTION = 'gene_subscription';

export default (pubsub: any) => ({
  Query: {
    async genes(obj: any, { filter, limit, after, orderBy }: any, context: any) {
      const geneOutput = await context.Gene.genes(limit, after, orderBy, filter);
      const { geneItems, total } = geneOutput;
      const hasNextPage = total > after + limit;

      const edgesArray = [];
      geneItems &&
        geneItems.map((geneItem, index) => {
          edgesArray.push({
            cursor: after + index,
            node: geneItem
          });
        });
      const endCursor = edgesArray.length > 0 ? edgesArray[edgesArray.length - 1].cursor : 0;
      return {
        totalCount: total,
        edges: edgesArray,
        pageInfo: {
          endCursor,
          hasNextPage
        }
      };
    },
    async gene(obj: any, { id, geneId, geneSymbol }: any, { Gene }: any) {
      const gene = await Gene.gene(id, geneId, geneSymbol);
      return gene;
    }
  },
  Mutation: {
    addGene: withAuth(async (obj: any, { input }: any, context: any) => {
      try {
        // if (!input.userId) {
        //   input.userId = context.req.identity.id;
        // }
        const ga = await context.Gene.addGene(input);
        const gene = await context.Gene.gene(ga.id);
        // publish for genes list
        pubsub.publish(GENE_SUBSCRIPTION, {
          geneUpdated: {
            mutation: 'CREATED',
            node: gene
          }
        });
        return gene;
      } catch (e) {
        return e;
      }
    }),
    editGene: withAuth(async (obj: any, { input }: any, context: any) => {
      try {
        await context.Gene.editGene(input);
        const gene = await context.Gene.gene(input.id);
        // publish for edit gene page
        pubsub.publish(GENE_SUBSCRIPTION, {
          geneUpdated: {
            mutation: 'UPDATED',
            node: gene
          }
        });
        return gene;
      } catch (e) {
        return e;
      }
    }),
    deleteGene: withAuth(async (obj: any, { id }: any, context: any) => {
      try {
        const gene = await context.Gene.gene(id);
        const isDeleted = await context.Gene.deleteGene(id);
        if (isDeleted) {
          // publish for edit gene page
          pubsub.publish(GENE_SUBSCRIPTION, {
            geneUpdated: {
              mutation: 'DELETED',
              node: gene
            }
          });
          return gene;
        } else {
          return null;
        }
      } catch (e) {
        throw Error('Deleting Gene Failed');
      }
    })
  },
  Subscription: {
    geneUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(GENE_SUBSCRIPTION),
        (payload, variables) => {
          const { mutation, node } = payload.geneUpdated;
          const {
            filter: { searchText }
          } = variables;
          const checkByFilter = !searchText || node.title.toUpperCase().includes(searchText.toUpperCase());
          switch (mutation) {
            case 'DELETED':
              return true;
            case 'CREATED':
              return checkByFilter;
            case 'UPDATED':
              return !checkByFilter;
          }
        }
      )
    }
  }
});
