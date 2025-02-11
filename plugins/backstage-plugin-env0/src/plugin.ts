import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  createComponentExtension,
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

export const env0Plugin = createPlugin({
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

export const Env0EnvironmentDetailsCard = env0Plugin.provide(
  createComponentExtension({
    name: 'Env0EnvironmentDetailsCard',
    component: {
      lazy: () =>
        import('./components/env0-environment-details-card').then(
          m => m.Env0EnvironmentDetailsCard,
        ),
    },
  }),
);

export const Env0TabComponent = env0Plugin.provide(
  createRoutableExtension({
    name: 'Env0TabComponent',
    mountPoint: rootRouteRef,
    component: () =>
      import('./components/env0-tab-component').then(m => m.Env0TabComponent),
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
      });
    },
  }),
);
