# env0 Backstage Plugin

This is a plugin for [Backstage](https://backstage.io) that allows you to create and manage environments using [env0](https://env0.com).

The plugin repository consists of two complementary plugins:
1. **env0 Scaffolder Backend Module**: Defines two custom actions:
   - `env0:environment:create`: Create a new env0 environment.
   - `env0:environment:redeploy`: Redeploy an existing env0 environment.
2. **env0 Plugin**: Provides the UI components to:
   - Create and redeploy env0 environments.
   - View deployment history.
   - Monitor the current status of environments.

For more information, see:
- [env0 Scaffolded Backend Module](https://github.com/env0/env0-backstage-plugin/tree/main/plugins/scaffolder-backend-module-env0)
- [env0 Plugin](https://github.com/env0/env0-backstage-plugin/tree/main/plugins/backstage-plugin-env0)

## Authentication

1. Create a new API key in your env0 organization ([docs](https://docs.env0.com/docs/api-keys)).
   1. Required permissions are:
      - `Run Applies`
      - `View Oragnization`
      - `View Project` (for the relevant projects)
2. Set the `ENV0_ACCESS_TOKEN` environment variable to the API key.

## Example

Please check the official env0 examples in the [examples folder](https://github.com/env0/env0-backstage-plugin/tree/main/examples).
