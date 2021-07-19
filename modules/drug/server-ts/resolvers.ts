import withAuth from 'graphql-auth';
import { withFilter } from 'graphql-subscriptions';

const DRUG_SUBSCRIPTION = 'drug_subscription';

export default (pubsub: any) => ({
  Query: {
    async drugs(obj: any, { filter, limit, after, orderBy }: any, context: any) {
      const drugOutput = await context.Drug.drugs(limit, after, orderBy, filter);
      const { drugItems, total } = drugOutput;
      const hasNextPage = total > after + limit;

      const edgesArray = [];
      drugItems &&
        drugItems.map((drugItem, index) => {
          edgesArray.push({
            cursor: after + index,
            node: drugItem
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
    async drug(obj: any, { id }: any, { Drug }: any) {
      const drug = await Drug.drug(id);
      return drug;
    }
  },
  Mutation: {
    addDrug: withAuth(async (obj: any, { input }: any, context: any) => {
      try {
        // if (!input.userId) {
        //   input.userId = context.req.identity.id;
        // }
        const ga = await context.Drug.addDrug(input);
        const drug = await context.Drug.drug(ga.id);
        // publish for drugs list
        pubsub.publish(DRUG_SUBSCRIPTION, {
          drugUpdated: {
            mutation: 'CREATED',
            node: drug
          }
        });
        return drug;
      } catch (e) {
        return e;
      }
    }),
    editDrug: withAuth(async (obj: any, { input }: any, context: any) => {
      try {
        await context.Drug.editDrug(input);
        const drug = await context.Drug.drug(input.id);
        // publish for edit drug page
        pubsub.publish(DRUG_SUBSCRIPTION, {
          drugUpdated: {
            mutation: 'UPDATED',
            node: drug
          }
        });
        return drug;
      } catch (e) {
        return e;
      }
    }),
    deleteDrug: withAuth(async (obj: any, { id }: any, context: any) => {
      try {
        const drug = await context.Drug.drug(id);
        const isDeleted = await context.Drug.deleteDrug(id);
        if (isDeleted) {
          // publish for edit drug page
          pubsub.publish(DRUG_SUBSCRIPTION, {
            drugUpdated: {
              mutation: 'DELETED',
              node: drug
            }
          });
          return drug;
        } else {
          return null;
        }
      } catch (e) {
        throw Error('Deleting Drug Failed');
      }
    })
  },
  Subscription: {
    drugUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(DRUG_SUBSCRIPTION),
        (payload, variables) => {
          const { mutation, node } = payload.drugUpdated;
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
