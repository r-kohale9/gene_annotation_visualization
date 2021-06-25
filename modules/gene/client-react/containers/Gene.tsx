import React from 'react';

import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import GeneView from '../components/GeneView';

interface GeneProps {
  t: TranslateFunction;
}

class Gene extends React.Component<GeneProps> {
  public render() {
    return <GeneView {...this.props} />;
  }
}

export default translate('gene')(Gene);
