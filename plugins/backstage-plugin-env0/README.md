# backstage-plugin-env0

Welcome to the backstage-plugin-env0 plugin!

_This plugin was created through the Backstage CLI_

## Getting started

Your plugin has been added to the example app in this repository, meaning you'll be able to access it by running `yarn start` in the root directory, and then navigating to [/env0](http://localhost:3000/env0).

You can also serve the plugin in isolation by running `yarn start` in the plugin directory.
This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.
It is only meant for local development, and the setup for it can be found inside the [/dev](./dev) directory.

## Use custom env0 template selector

This custom scaffolder field, fetches all available env0 templates based on the permissions of the API key provided in the `app-config.yaml`.

It do it by query the available organizations for the api key, then the projects for each organization and finally the templates assigned for those projects.

It can be installed as follows in the `App.tsx`

```tsx
...
<Route path="/create" element={<ScaffolderPage />}>
    <ScaffolderFieldExtensions>
        ...
        <Env0TemplateSelectorExtension />
    </ScaffolderFieldExtensions>
</Route>
...
```

Here is an example of its use in a template:
```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: env0-environment-from-template
  title: Deploy an env0 Environment
  description: |
    A template to deploy an env0 environment.
    This template will create an env0 environment as a backstage component.
    You will choose an env0 template to be deployed as an env0 environment from an exposed list of env0 templates by your admin.
  tags:
    - env0
spec:
  type: infrastructure
  parameters:
    - title: Basic Information Step
      required:
        - env0_template_id
      properties:
        env0_template_id:
          title: env0 Template
          type: string
          ui:field: Env0TemplateSelector
          description: IaC template to be deployed.
```
