import React from 'react';

import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import DiseaseView from '../components/DiseaseView';

interface DiseaseProps {
  t: TranslateFunction;
}

class Disease extends React.Component<DiseaseProps> {
  public render() {
    return <DiseaseView {...this.props} />;
  }
}

export default translate('disease')(Disease);
