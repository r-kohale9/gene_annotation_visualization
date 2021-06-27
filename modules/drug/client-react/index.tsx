import React from 'react';

import ClientModule from '@gqlapp/module-client-react';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import loadable from '@loadable/component';

import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '@gqlapp/look-client-react';
import resources from './locales';

const NavLinkWithI18n = translate('drug')(({ t }: { t: TranslateFunction }) => (
  <NavLink to="/drug" className="nav-link" activeClassName="active">
    {t('drug:navLink')}
  </NavLink>
));

export default new ClientModule({
  route: [<Route exact path="/drug" component={loadable(() => import('./containers/Drug').then(c => c.default))} />],
  navItem: [
    <MenuItem key="/drug">
      <NavLinkWithI18n />
    </MenuItem>
  ],
  localization: [{ ns: 'drug', resources }]
});
