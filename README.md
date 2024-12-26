# Env0 Backstage Plugin

This is a plugin for [Backstage](https://backstage.io) that allows you to create and manage environments using [Env0](https://env0.com).

The plugin repository consists of two complementary plugins:
1. **Env0 Scaffolder Backend Module**: Defines two custom actions:
   - `env0:environment:create`: Create a new Env0 environment.
   - `env0:environment:redeploy`: Redeploy an existing Env0 environment.
2. **Env0 Plugin**: Provides the UI components to:
   - Create and redeploy Env0 environments.
   - View deployment history.
   - Monitor the current status of environments.

For more information, see:
- [Env0 Scaffolded Backend Module](./plugins/scaffolder-backend-module-env0/README.md)
- [Env0 Plugin](./plugins/backstage-plugin-env0/README.md)

## Authentication

1. Create a new API key in your Env0 organization ([docs](https://docs.env0.com/docs/api-keys)).
2. Set the `ENV0_ACCESS_TOKEN` environment variable to the API key.

