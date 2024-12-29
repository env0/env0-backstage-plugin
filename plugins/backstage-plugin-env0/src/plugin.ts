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
  Env0ProjectSelector,
  Env0ProjectSelectorSchema,
} from './components/env0-project-selector';
import {
  Env0VariableInputSchema,
  Env0VariablesScaffolderInput,
} from './components/env0-variables-input';
import { Variable } from './api/types';
import { doesVariableValueMatchRegex } from './components/env0-variables-input/env0-variable-field';

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

export const Env0ProjectSelectorExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    name: 'Env0ProjectSelector',
    component: Env0ProjectSelector,
    schema: Env0ProjectSelectorSchema,
  }),
);

export const Env0VariableInputExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    name: 'Env0VariablesInput',
    component: Env0VariablesScaffolderInput,
    schema: Env0VariableInputSchema,
    validation: (variables, validation) => {
      variables.forEach(variable => {
        if (!doesVariableValueMatchRegex(variable as Variable)) {
          validation.addError(
            `value for variable "${variable.name}" does not match regex: ${variable.regex}`,
          );
        }

        if ((variable as Variable).isRequired && !variable.value) {
          validation.addError(
            `variable "${variable.name}" is required, and cannot be empty`,
          );
        }
      });
    },
  }),
);
