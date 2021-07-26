import React from 'react';
import { graphql } from 'react-apollo';
import queryString from 'query-string';

import { compose } from '@gqlapp/core-common';
import GeneListView from '../components/GeneListView';
import { withGenes } from './GenesOperations'

const GeneList = (props) => {
  console.log(props);
  return (
    <GeneListView {...props} />
  );
}


export default compose(withGenes)(GeneList);
