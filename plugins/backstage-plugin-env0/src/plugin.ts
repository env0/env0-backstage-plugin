import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import { env0ApiRef, Env0Client } from './api';
import { Env0StepTemplateSelector } from './components/env0-step-template-selector/env0-step-template-selector';
import { createScaffolderFieldExtension } from '@backstage/plugin-scaffolder-react';
import { scaffolderPlugin } from '@backstage/plugin-scaffolder';

export const backstagePluginEnv0Plugin = createPlugin({
  id: 'env0',
  apis: [
    createApiFactory({
      api: env0ApiRef,
      deps: { discoveryApi: discoveryApiRef, fetchApi: fetchApiRef },
      factory: ({ discoveryApi, fetchApi }) =>
        new Env0Client({ discoveryApi, fetchApi }),
    }),
  ],
});

export const BackstagePluginEnv0Page = backstagePluginEnv0Plugin.provide(
  createRoutableExtension({
    name: 'BackstagePluginEnv0Page',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);

export const Env0StepTemplateSelectorExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    name: 'Env0StepTemplateSelector',
    component: Env0StepTemplateSelector,
  }),
);
