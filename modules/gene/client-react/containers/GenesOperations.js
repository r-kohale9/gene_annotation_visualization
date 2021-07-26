import { graphql } from "react-apollo";
import update from "immutability-helper";
import { removeTypename, log } from "@gqlapp/core-common";
import GENES_QUERY from "../graphql/GenesQuery.graphql";
import queryString from "query-string";

// import USERS_STATE_QUERY from '../graphql/UsersStateQuery.client.graphql';
// import UPDATE_ORDER_BY from '../graphql/UpdateOrderBy.client.graphql';
// import DELETE_USER from '../graphql/DeleteUser.graphql';
// import UPDATE_FILTER from '../graphql/UpdateFilter.client.graphql';

// const withUsersState = Component =>
//   graphql(USERS_STATE_QUERY, {
//     props({ data: { usersState } }) {
//       return removeTypename(usersState);
//     }
//   })(Component);

const limit = 10;

const withGenes = (Component) =>
  graphql(GENES_QUERY, {
    options: ({ orderBy, filter, history }) => {
      const {
        location: { search },
      } = history;
      const params = queryString.parse(search);

      const filterss = { searchText: params.searchQuery };
      return {
        // eslint-disable-next-line prettier/prettier
        variables: { filter: filterss, limit: limit, after: 0, orderBy },
        fetchPolicy: "network-only",
      };
    },
    props: ({ data }) => {
      const {
        loading,
        error,
        genes,
        fetchMore,
        updateQuery,
        subscribeToMore,
      } = data;
      // console.log("ops", profiles);
      const loadDataGenes = async (after, dataDelivery) => {
        return await fetchMore({
          variables: {
            after: after,
          },

          updateQuery: (previousResult, { fetchMoreResult }) => {
            const totalCount = fetchMoreResult.genes.totalCount;
            const newEdges = fetchMoreResult.genes.edges;
            const pageInfo = fetchMoreResult.genes.pageInfo;
            const displayedEdges =
              dataDelivery === "add"
                ? [...previousResult.genes.edges, ...newEdges]
                : newEdges;
            return {
              genes: {
                // By returning `cursor` here, we update the `fetchMore` function
                // to the new cursor.

                totalCount,
                edges: displayedEdges,
                pageInfo,
                __typename: "Profiles",
              },
            };
          },
        });
      };
      if (error) throw new Error(error);
      return {
        loading,
        genes,
        loadDataGenes,
        updateQuery,
        subscribeToMore,
      };
    },
  })(Component);

// const withUsersDeleting = Component =>
//   graphql(DELETE_USER, {
//     props: ({ mutate }) => ({
//       deleteUser: async id => {
//         try {
//           const {
//             data: { deleteUser }
//           } = await mutate({
//             variables: { id }
//           });

//           if (deleteUser.errors) {
//             return { errors: deleteUser.errors };
//           }
//         } catch (e) {
//           log.error(e);
//         }
//       }
//     })
//   })(Component);

// const withOrderByUpdating = Component =>
//   graphql(UPDATE_ORDER_BY, {
//     props: ({ mutate }) => ({
//       onOrderBy: orderBy => {
//         mutate({ variables: { orderBy } });
//       }
//     })
//   })(Component);

// const withFilterUpdating = Component =>
//   graphql(UPDATE_FILTER, {
//     props: ({ mutate }) => ({
//       onSearchTextChange(searchText) {
//         mutate({ variables: { filter: { searchText } } });
//       },
//       onRoleChange(role) {
//         mutate({ variables: { filter: { role } } });
//       },
//       onIsActiveChange(isActive) {
//         mutate({ variables: { filter: { isActive } } });
//       }
//     })
//   })(Component);

// const updateUsersState = (usersUpdated, updateQuery) => {
//   const { mutation, node } = usersUpdated;
//   updateQuery(prev => {
//     switch (mutation) {
//       case 'CREATED':
//         return addUser(prev, node);
//       case 'DELETED':
//         return deleteUser(prev, node.id);
//       case 'UPDATED':
//         return deleteUser(prev, node.id);
//       default:
//         return prev;
//     }
//   });
// };

// function addUser(prev, node) {
//   // check if it is duplicate
//   if (prev.users.some(user => user.id === node.id)) {
//     return prev;
//   }

//   return update(prev, {
//     users: {
//       $set: [...prev.users, node]
//     }
//   });
// }

// function deleteUser(prev, id) {
//   const index = prev.users.findIndex(user => user.id === id);
//   // ignore if not found
//   if (index < 0) {
//     return prev;
//   }
//   return update(prev, {
//     users: {
//       $splice: [[index, 1]]
//     }
//   });
// }

export {
  withGenes,
  //     withUsersState,
  //     withUsersDeleting,
  //     withOrderByUpdating,
  //   withFilterUpdating,
};
// export { updateUsersState };
