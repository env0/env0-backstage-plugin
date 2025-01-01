# env0 Scaffolded Backend Module

## Prerequisites

### env0 Access Token

Please refer to the root [README](https://github.com/env0/env0-backstage-plugin/blob/main/README.md#authentication) for instructions on how to set up the env0 access token.

## Getting Started

#### 1. Install the plugin into your Backstage instance:
```bash
# From your Backstage root directory
yarn --cwd packages/backend add @env0/backstage-scaffolder-backend-env0
```

#### 2. Configure the plugin in your Backstage instance ([docs](https://backstage.io/docs/features/software-templates/writing-custom-actions/#registering-custom-actions)):
```ts
// In packages/backend/src/index.ts
const backend = createBackend();
backend.add(import('@env0/backstage-scaffolder-backend-env0'));
```

## Available Actions

### env0 Environment Create

Create a new env0 environment.

`env0:environment:create`

#### Inputs

| Input       | Description                                            | Type                      | Required |
|-------------|--------------------------------------------------------|---------------------------|----------|
| name        | The name of the environment to be created.             | string                    | Yes      |
| projectId   | The Project ID in which to create the environment.     | string                    | Yes      |
| templateId  | The Template ID from which to create the environment.  | string                    | Yes      |
| comment     | A comment to the initial deployment.                   | string                    | No       |
| variables   | A list of variables to add to the environment.         | array(env0VariableObject) | No       |

The `env0VariableObject` schema is defined as:
```ts
{
  id?: string; // Optional. The variable id. Used to update an existing variable.
  name: string; // The variable name.
  value: string; // The variable value.
}
```

#### Outputs
| Output         | Description                                                  | 
|----------------|--------------------------------------------------------------|
| environmentId  | The environment's ID.                                        | 
| organizationId | The ID of the organization to which the environment belongs. | 
| environmentUrl | The environment's URL.                                       | 

#### Example
    
```yaml
steps:
  - id: create-env0-environment
    name: Create env0 Environment
    action: env0:environment:create
    input:
      name: my-env
      projectId: my-project-id
      templateId: my-template-id
      comment: Initial deployment
      variables:
        - name: MY_VAR
          value: my-value
```

### env0 Environment Redeploy

Redeploy an existing env0 environment.

`env0:environment:redeploy`

#### Inputs

| Input     | Description                                           | Type                      | Required |
|-----------|-------------------------------------------------------|---------------------------|----------|
| id        | The environment's ID to redeploy.                     | string                    | Yes      |
| comment   | A comment to the new deployment.                      | string                    | No       |
| variables | A list of variables to add/modify to the environment. | array(env0VariableObject) | No       |

### Outputs

| Output         | Description                      |
|----------------|----------------------------------|
| environmentId  | The environment's ID.            |
| deploymentId   | The newly created deployment ID. |
| deploymentUrl  | The deployment's URL.            |

#### Example
    
```yaml
steps:
  - id: redeploy-env0-environment
    name: Redeploy env0 Environment
    action: env0:environment:redeploy
    input:
      id: my-env-id
      comment: New deployment
      variables:
        - name: MY_VAR
          value: my-new-value

```
