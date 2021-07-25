import React from 'react';
import { graphql } from 'react-apollo';

import { compose } from '@gqlapp/core-common';
import ChartView from '../components/ChartView';
import GENE_QUERY from '../graphql/GeneQuery.graphql';

class Chart extends React.Component {
  render() {
    console.log('this.props', this.props);
    return <ChartView {...this.props} />;
  }
}

export default compose(
  graphql(GENE_QUERY, {
    options: ({ match }) => {
      console.log('match', match);
      const geneId = match.params.geneId;
      return {
        fetchPolicy: 'network-only',
        variables: { geneId: geneId }
      };
    },
    props({ data: { loading, error, gene } }) {
      console.log(gene);
      if (error) throw new Error(error);
      return { loading, gene };
    }
  })
)(Chart);
