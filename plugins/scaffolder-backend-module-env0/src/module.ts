import { createBackendModule } from '@backstage/backend-plugin-api';
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';
import { createEnv0CreateEnvironmentAction } from './actions/create-environment';
import { createEnv0RedeployEnvironmentAction } from './actions/redeploy-environment';

export const scaffolderModule = createBackendModule({
  moduleId: 'env0',
  pluginId: 'scaffolder',
  register({ registerInit }) {
    registerInit({
      deps: {
        scaffolderActions: scaffolderActionsExtensionPoint,
      },
      async init({ scaffolderActions }) {
        scaffolderActions.addActions(createEnv0CreateEnvironmentAction());
        scaffolderActions.addActions(createEnv0RedeployEnvironmentAction());
      },
    });
  },
});
