import ServerModule from '@gqlapp/module-server-ts';

import schema from './schema.graphql';
import createResolvers from './resolvers';
import Disease from './sql';

export default new ServerModule({
  schema: [schema],
  createResolversFunc: [createResolvers],
  createContextFunc: [() => ({ Disease: new Disease() })]
});
