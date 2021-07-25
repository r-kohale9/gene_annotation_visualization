import React from 'react';

import ClientModule from '@gqlapp/module-client-react';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import loadable from '@loadable/component';

import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '@gqlapp/look-client-react';
import resources from './locales';

// const NavLinkWithI18n = translate('chart')(({ t }: { t: TranslateFunction }) => (
//   <NavLink to="/chart" className="nav-link" activeClassName="active">
//     {t('chart:navLink')}
//   </NavLink>
// ));

export default new ClientModule({
  route: [<Route exact path="/chart/:geneId" component={loadable(() => import('./containers/Chart').then(c => c.default))} />],
  // navItem: [
  //   <MenuItem key="/chart">
  //     <NavLinkWithI18n />
  //   </MenuItem>
  // ],
  localization: [{ ns: 'chart', resources }]
});
