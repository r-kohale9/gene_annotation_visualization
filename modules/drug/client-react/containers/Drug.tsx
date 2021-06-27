import React from 'react';

import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import DrugView from '../components/DrugView';

interface DrugProps {
  t: TranslateFunction;
}

class Drug extends React.Component<DrugProps> {
  public render() {
    return <DrugView {...this.props} />;
  }
}

export default translate('drug')(Drug);
