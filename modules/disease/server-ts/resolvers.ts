import withAuth from 'graphql-auth';
import { withFilter } from 'graphql-subscriptions';

const DISEASE_SUBSCRIPTION = 'disease_subscription';

export default (pubsub: any) => ({
  Query: {
    async diseases(obj: any, { filter, limit, after, orderBy }: any, context: any) {
      const diseaseOutput = await context.Disease.diseases(limit, after, orderBy, filter);
      const { diseaseItems, total } = diseaseOutput;
      const hasNextPage = total > after + limit;

      const edgesArray = [];
      diseaseItems &&
        diseaseItems.map((diseaseItem, index) => {
          edgesArray.push({
            cursor: after + index,
            node: diseaseItem
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
    async disease(obj: any, { id }: any, { Disease }: any) {
      const disease = await Disease.disease(id);
      return disease;
    }
  },
  Mutation: {
    addDisease: withAuth(async (obj: any, { input }: any, context: any) => {
      try {
        // if (!input.userId) {
        //   input.userId = context.req.identity.id;
        // }
        const ga = await context.Disease.addDisease(input);
        const disease = await context.Disease.disease(ga.id);
        // publish for diseases list
        pubsub.publish(DISEASE_SUBSCRIPTION, {
          diseaseUpdated: {
            mutation: 'CREATED',
            node: disease
          }
        });
        return disease;
      } catch (e) {
        return e;
      }
    }),
    editDisease: withAuth(async (obj: any, { input }: any, context: any) => {
      try {
        await context.Disease.editDisease(input);
        const disease = await context.Disease.disease(input.id);
        // publish for edit disease page
        pubsub.publish(DISEASE_SUBSCRIPTION, {
          diseaseUpdated: {
            mutation: 'UPDATED',
            node: disease
          }
        });
        return disease;
      } catch (e) {
        return e;
      }
    }),
    deleteDisease: withAuth(async (obj: any, { id }: any, context: any) => {
      try {
        const disease = await context.Disease.disease(id);
        const isDeleted = await context.Disease.deleteDisease(id);
        if (isDeleted) {
          // publish for edit disease page
          pubsub.publish(DISEASE_SUBSCRIPTION, {
            diseaseUpdated: {
              mutation: 'DELETED',
              node: disease
            }
          });
          return disease;
        } else {
          return null;
        }
      } catch (e) {
        throw Error('Deleting Disease Failed');
      }
    })
  },
  Subscription: {
    diseaseUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(DISEASE_SUBSCRIPTION),
        (payload, variables) => {
          const { mutation, node } = payload.diseaseUpdated;
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
