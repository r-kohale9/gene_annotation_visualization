import React from 'react';

import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import CellView from '../components/CellView';

interface CellProps {
  t: TranslateFunction;
}

class Cell extends React.Component<CellProps> {
  public render() {
    return <CellView {...this.props} />;
  }
}

export default translate('cell')(Cell);
