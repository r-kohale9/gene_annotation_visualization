import withAuth from 'graphql-auth';
import { withFilter } from 'graphql-subscriptions';

const CELL_SUBSCRIPTION = 'cell_subscription';

export default (pubsub: any) => ({
  Query: {
    async cells(obj: any, { filter, limit, after, orderBy }: any, context: any) {
      const cellOutput = await context.Cell.cells(limit, after, orderBy, filter);
      const { cellItems, total } = cellOutput;
      const hasNextPage = total > after + limit;

      const edgesArray = [];
      cellItems &&
        cellItems.map((cellItem, index) => {
          edgesArray.push({
            cursor: after + index,
            node: cellItem
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
    async cell(obj: any, { id }: any, { Cell }: any) {
      const cell = await Cell.cell(id);
      return cell;
    }
  },
  Mutation: {
    addCell: withAuth(async (obj: any, { input }: any, context: any) => {
      try {
        // if (!input.userId) {
        //   input.userId = context.req.identity.id;
        // }
        const ga = await context.Cell.addCell(input);
        const cell = await context.Cell.cell(ga.id);
        // publish for cells list
        pubsub.publish(CELL_SUBSCRIPTION, {
          cellUpdated: {
            mutation: 'CREATED',
            node: cell
          }
        });
        return cell;
      } catch (e) {
        return e;
      }
    }),
    editCell: withAuth(async (obj: any, { input }: any, context: any) => {
      try {
        await context.Cell.editCell(input);
        const cell = await context.Cell.cell(input.id);
        // publish for edit cell page
        pubsub.publish(CELL_SUBSCRIPTION, {
          cellUpdated: {
            mutation: 'UPDATED',
            node: cell
          }
        });
        return cell;
      } catch (e) {
        return e;
      }
    }),
    deleteCell: withAuth(async (obj: any, { id }: any, context: any) => {
      try {
        const cell = await context.Cell.cell(id);
        const isDeleted = await context.Cell.deleteCell(id);
        if (isDeleted) {
          // publish for edit cell page
          pubsub.publish(CELL_SUBSCRIPTION, {
            cellUpdated: {
              mutation: 'DELETED',
              node: cell
            }
          });
          return cell;
        } else {
          return null;
        }
      } catch (e) {
        throw Error('Deleting Cell Failed');
      }
    })
  },
  Subscription: {
    cellUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(CELL_SUBSCRIPTION),
        (payload, variables) => {
          const { mutation, node } = payload.cellUpdated;
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
