import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import { env0ApiRef, Env0Client } from './api';
import {
  Env0TemplateSelector,
  Env0TemplateSelectorSchema,
} from './components/env0-template-selector';
import { createScaffolderFieldExtension } from '@backstage/plugin-scaffolder-react';
import { scaffolderPlugin } from '@backstage/plugin-scaffolder';
import {
  Env0VariableInputSchema,
  Env0VariablesInput,
} from './components/env0-variables-input';

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
      import('./components/env0-environment-details-card').then(
        m => m.Env0EnvironmentDetailsCard,
      ),
    mountPoint: rootRouteRef,
  }),
);

export const Env0TemplateSelectorExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    name: 'Env0TemplateSelector',
    component: Env0TemplateSelector,
    schema: Env0TemplateSelectorSchema,
  }),
);

export const Env0VariableInputExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    name: 'Env0VariablesInput',
    component: Env0VariablesInput,
    schema: Env0VariableInputSchema,
  }),
);
