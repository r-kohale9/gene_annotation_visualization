import React from 'react';

import ClientModule from '@gqlapp/module-client-react';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import loadable from '@loadable/component';

import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '@gqlapp/look-client-react';
import resources from './locales';

const NavLinkWithI18n = translate('home')(({ t }: { t: TranslateFunction }) => (
  <NavLink to="/" className="nav-link" activeClassName="active">
    {t('home:navLink')}
  </NavLink>
));

export default new ClientModule({
  route: [<Route exact path="/gene/list" component={loadable(() => import('./containers/GeneList').then(c => c.default))} />],
  // navItem: [
  //   <MenuItem key="/">
  //     <NavLinkWithI18n />
  //   </MenuItem>
  // ],
  localization: [{ ns: 'home', resources }]
});
