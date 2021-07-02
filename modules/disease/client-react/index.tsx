import React from 'react';

import ClientModule from '@gqlapp/module-client-react';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import loadable from '@loadable/component';

import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '@gqlapp/look-client-react';
import resources from './locales';

const NavLinkWithI18n = translate('disease')(({ t }: { t: TranslateFunction }) => (
  <NavLink to="/disease" className="nav-link" activeClassName="active">
    {t('disease:navLink')}
  </NavLink>
));

export default new ClientModule({
  route: [
    <Route exact path="/disease" component={loadable(() => import('./containers/Disease').then(c => c.default))} />
  ],
  navItem: [
    <MenuItem key="/disease">
      <NavLinkWithI18n />
    </MenuItem>
  ],
  localization: [{ ns: 'disease', resources }]
});
