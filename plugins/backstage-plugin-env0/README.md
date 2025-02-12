# env0 Backstage Plugin

This plugin adds UI components that allows you to:
- See the deployment history of env0 environments.
- Monitor the current status of env0 environments.
- Redeploy existing env0 environments.

## Prerequisites

### env0 Access Token

Please refer to the root [README](https://github.com/env0/env0-backstage-plugin/blob/main/README.md#authentication) for instructions on how to set up the env0 access token.

## Getting Started

### 1. Install the plugin in your Backstage instance:
```bash
# From your Backstage root directory
yarn --cwd packages/app add @env0/backstage-plugin-env0
```

### 2. Add the env0 tab component to `EntityPage.tsx`:

#### Import the components:
```tsx
// In packages/app/src/components/catalog/EntityPage.tsx
import {
  Env0TabComponent,
  isEnv0Available,
  Env0EnvironmentDetailsCard,
} from '@env0/backstage-plugin-env0';
```

#### Add the env0 tab component to the `serviceEntityPage` constant:
```tsx
// In packages/app/src/components/catalog/EntityPage.tsx
<EntityLayout.Route
  if={isEnv0Available}
  path="/env0"
  title="env0"
>
  <Env0TabComponent />
</EntityLayout.Route>
```

### 3. Add the env0 details component to `EntityPage.tsx`:
#### Add the env0 details component to the `ovreviewContent` constant:

> [!NOTE]
> The `overviewContent` is a `Grid` component that contains the overview tab content of the entity page.
> Please make sure to add the following `EntitySwitch` component inside the outermost `Grid` defined there, just before the closing `</Grid>` tag

```tsx
// In packages/app/src/components/catalog/EntityPage.tsx
<EntitySwitch>
  <EntitySwitch.Case if={isEnv0Available}>
    <Env0EnvironmentDetailsCard />
  </EntitySwitch.Case>
</EntitySwitch>
```
### 4. Provide the env0 proxy configuration in `app-config.yaml`:
```yaml
proxy:
  '/env0':
  target: 'https://api.env0.com'
  changeOrigin: true
  headers:
    Authorization: Basic ${ENV0_ACCESS_TOKEN}
    Accept: application/json
    Content-Type: application/json
```

## Required Annotations

> [!NOTE]
> The following annotations are automatically added by the `catalog-info.yaml` template, so there’s no need to add them manually.
> This is just a reminder to ensure these annotations are present and that you’re using the correct `catalog-info.yaml` file, located in this repository.

```yaml
annotations:
env0.com/environment-id: <environment-id>
env0.com/organization-id: <organization-id>
```

## Feature Overview

### Core UI Components

#### Environment Details
The Environment Details card displays basic information about the environment, such as environment name, status, and who created it.

![image](https://github.com/user-attachments/assets/27880c81-e0da-460a-bff4-ef5d2ac1d201)

#### Deployment History
The Deployment History table displays the history of the environment’s deployments, including deployment status, deployment plan summary, and time of deployment.

![image](https://github.com/user-attachments/assets/f8504070-bbf6-4fe8-8fc0-70f900926876)


### Scaffolder UI Components

#### Variable Input
This custom scaffolder field is used to input the values for the variables of the selected env0 template and project.
It fetches the variables of the selected template and project and renders the input fields for each variable.

![image](https://github.com/user-attachments/assets/2b3e479d-1f76-4ea8-b70c-d0a4333e405f)

It can be installed as follows in the `App.tsx`
```tsx
<Route path="/create" element={<ScaffolderPage />}>
    <ScaffolderFieldExtensions>
        <Env0VariableInputExtension />
    </ScaffolderFieldExtensions>
</Route>
```

Here is an example of its use in a template:
```yaml
- spec:
  type: infrastructure
  parameters:
    - title: Variables
      required:
        - env0_variables
      properties:
        env0_variables:
          title: Variables
          type: array
          ui:field: Env0VariablesInput
          ui:backstage:
            review:
              show: false
          items:
            type: object
            properties:
              name:
                type: string
              value:
                type: string
            additionalProperties: true
          required:
            - env0_variables
          description: IaC / Environment Variables
```

#### Template Selector
This custom scaffolder field fetches all available env0 templates based on the permissions of the API key provided in the `app-config.yaml`.
It does that by querying the available organizations for the API key, then the projects for each organization and finally the templates assigned for those projects.

It can be installed as follows in the `App.tsx`

```tsx
<Route path="/create" element={<ScaffolderPage />}>
    <ScaffolderFieldExtensions>
        <Env0TemplateSelectorExtension />
    </ScaffolderFieldExtensions>
</Route>
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

#### Project Selector
This custom scaffolder field fetches all available env0 projects based on the permissions of the API key provided in the `app-config.yaml` and the selected template ID (if provided).
It queries the available projects for the API key and then filters the projects that are assigned to that template. 
If no template ID is provided, it will fetch all projects.

It can be installed as follows in the `App.tsx`

```tsx

<Route path="/create" element={<ScaffolderPage />}>
    <ScaffolderFieldExtensions>
        <Env0ProjectSelectorExtension />
    </ScaffolderFieldExtensions>
</Route>

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
        env0_Project_id:
          title: env0 Project
          type: string
          ui:field: Env0ProjectSelector
          ui:options:
            env0TemplateId: "uuid"
          description: env0 project deploy to.
```

> [!TIP]
> To dynamically use the template ID from the property, you should name the template ID property as `env0_template_id` and the project ID property as `env0_project_id`.

To set a static template id to filter by, use:
```yaml
ui:options:
  env0TemplateId: "uuid"
```

> [!NOTE]
> The project selector requires a template being selected,
> either from `env0_template_id` or the `env0TemplateId` `ui:option`

