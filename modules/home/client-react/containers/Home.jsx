import React from 'react';
import { graphql } from 'react-apollo';

import { compose } from '@gqlapp/core-common';
import HomeView from '../components/HomeView';
import GENE_QUERY from '../graphql/GeneQuery.graphql'



class Home extends React.Component {
  render() {
    console.log('this.props', this.props);
    return <HomeView {...this.props} />;
  }
}

export default compose(
  graphql(GENE_QUERY, {
    options: ({match}) => {
      console.log('match', match)
      return {
        fetchPolicy: 'network-only',
        variables: { geneId: "3148" }
      };
    },
    props({ data: { loading, error, gene } }) {
      if (error) throw new Error(error);
      return { loading, gene };
    }
  }),
  )(Home);
