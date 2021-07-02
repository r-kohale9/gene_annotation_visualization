import React from 'react';
import { createStackNavigator } from 'react-navigation';

import { translate } from '@gqlapp/i18n-client-react';
import ClientModule from '@gqlapp/module-client-react-native';
import { HeaderTitle, IconButton } from '@gqlapp/look-client-react-native';

import Disease from './containers/Disease';
import resources from './locales';

const HeaderTitleWithI18n = translate('disease')(HeaderTitle);

export default new ClientModule({
  drawerItem: [
    {
      Disease: {
        screen: createStackNavigator({
          Disease: {
            screen: Disease,
            navigationOptions: ({ navigation }: any) => ({
              headerTitle: <HeaderTitleWithI18n style="subTitle" />,
              headerLeft: (
                <IconButton iconName="menu" iconSize={32} iconColor="#0275d8" onPress={() => navigation.openDrawer()} />
              ),
              headerStyle: { backgroundColor: '#fff' }
            })
          }
        }),
        navigationOptions: {
          drawerLabel: <HeaderTitleWithI18n />
        }
      }
    }
  ],
  localization: [{ ns: 'disease', resources }]
});
