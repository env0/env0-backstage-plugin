import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const backstagePluginEnv0Plugin = createPlugin({
  id: 'env0',
  routes: {
    root: rootRouteRef,
  },
});

export const BackstagePluginEnv0Page = backstagePluginEnv0Plugin.provide(
  createRoutableExtension({
    name: 'BackstagePluginEnv0Page',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
