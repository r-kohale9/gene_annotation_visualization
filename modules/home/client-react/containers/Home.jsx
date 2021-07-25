import React from 'react';
import { graphql } from 'react-apollo';

import { compose } from '@gqlapp/core-common';
import HomeView from '../components/HomeView';

class Home extends React.Component {
  render() {
    console.log('this.props', this.props);
    return <HomeView {...this.props} />;
  }
}

export default (Home);
