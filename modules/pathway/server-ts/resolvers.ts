import withAuth from 'graphql-auth';
import { withFilter } from 'graphql-subscriptions';

const PATHWAY_SUBSCRIPTION = 'pathway_subscription';

export default (pubsub: any) => ({
  Query: {
    async pathways(obj: any, { filter, limit, after, orderBy }: any, context: any) {
      const pathwayOutput = await context.Pathway.pathways(limit, after, orderBy, filter);
      const { pathwayItems, total } = pathwayOutput;
      const hasNextPage = total > after + limit;

      const edgesArray = [];
      pathwayItems &&
        pathwayItems.map((pathwayItem, index) => {
          edgesArray.push({
            cursor: after + index,
            node: pathwayItem
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
    async pathway(obj: any, { id }: any, { Pathway }: any) {
      const pathway = await Pathway.pathway(id);
      return pathway;
    }
  },
  Mutation: {
    addPathway: withAuth(async (obj: any, { input }: any, context: any) => {
      try {
        // if (!input.userId) {
        //   input.userId = context.req.identity.id;
        // }
        const ga = await context.Pathway.addPathway(input);
        const pathway = await context.Pathway.pathway(ga.id);
        // publish for pathways list
        pubsub.publish(PATHWAY_SUBSCRIPTION, {
          pathwayUpdated: {
            mutation: 'CREATED',
            node: pathway
          }
        });
        return pathway;
      } catch (e) {
        return e;
      }
    }),
    editPathway: withAuth(async (obj: any, { input }: any, context: any) => {
      try {
        await context.Pathway.editPathway(input);
        const pathway = await context.Pathway.pathway(input.id);
        // publish for edit pathway page
        pubsub.publish(PATHWAY_SUBSCRIPTION, {
          pathwayUpdated: {
            mutation: 'UPDATED',
            node: pathway
          }
        });
        return pathway;
      } catch (e) {
        return e;
      }
    }),
    deletePathway: withAuth(async (obj: any, { id }: any, context: any) => {
      try {
        const pathway = await context.Pathway.pathway(id);
        const isDeleted = await context.Pathway.deletePathway(id);
        if (isDeleted) {
          // publish for edit pathway page
          pubsub.publish(PATHWAY_SUBSCRIPTION, {
            pathwayUpdated: {
              mutation: 'DELETED',
              node: pathway
            }
          });
          return pathway;
        } else {
          return null;
        }
      } catch (e) {
        throw Error('Deleting Pathway Failed');
      }
    })
  },
  Subscription: {
    pathwayUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(PATHWAY_SUBSCRIPTION),
        (payload, variables) => {
          const { mutation, node } = payload.pathwayUpdated;
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
