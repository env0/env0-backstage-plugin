# backstage-scaffolder-backend-env0

This plugin backend was templated using the Backstage CLI. You should replace this text with a description of your plugin backend.

## Installation

This plugin is installed via the `backstage-scaffolder-backend-env0` package. To install it to your backend package, run the following command:

```bash
# From your root directory
yarn --cwd packages/backend add backstage-scaffolder-backend-env0
```

Then add the plugin to your backend in `packages/backend/src/index.ts`:

```ts
const backend = createBackend();
// ...
backend.add(import('backstage-scaffolder-backend-env0'));
```

## Development

This plugin backend can be started in a standalone mode from directly in this
package with `yarn start`. It is a limited setup that is most convenient when
developing the plugin backend itself.

If you want to run the entire project, including the frontend, run `yarn dev` from the root directory.
