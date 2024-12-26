# Env0 Scaffolded Backend Module

## Prerequisites

### Env0 Access Token
1. Create a new API key in your Env0 organization ([docs](https://docs.env0.com/docs/api-keys)).
2. Set the `ENV0_ACCESS_TOKEN` environment variable to the API key.

## Getting Started

### Installation

Install the plugin into your Backstage instance:
```bash
# From your Backstage root directory
yarn add --cwd packages/backend @pulumi/backstage-scaffolder-backend-pulumi
```

Configure the plugin in your Backstage instance ([docs](https://backstage.io/docs/features/software-templates/writing-custom-actions/#registering-custom-actions)):
```ts
// In packages/backend/src/index.ts
const backend = createBackend();
backend.add('@env0/backstage-scaffolder-backend-env0')
```

## Available Actions

### Env0 Environment Create

Create a new Env0 environment.

`env0:environment:create`

#### Inputs

| Input     | Description                                     | Type                      | Required 
|-----------|-------------------------------------------------|---------------------------|----------|
| name      | The name of the environment to be created.      | string                    | Yes      |
| projectId | The project id to create the environment in.    | string                    | Yes      |
| templateId | The template id to create the environment from. | string                    | Yes      |
| comment   | A comment to the initial deployment.            | string                    | No       |
| variables | A list of variables to add to the environment.  | array(env0VariableObject) | No       |

The `env0VariableObject` schema is defined as:
```ts
{
  id?: string; // Optional. The variable id. Used to update an existing variable.
  name: string; // The variable name.
  value: string; // The variable value.
}
```

#### Outputs
| Output         | Description                                                 | 
|----------------|-------------------------------------------------------------|
| environmentId  | The environment id.                                         | 
| organizationId | The id of the organization that the environment belongs to. | 
| environmentUrl     | The URL of to the environment.                              | 

#### Example
    
```yaml
steps:
  - id: create-env0-environment
    name: Create Env0 Environment
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

### Env0 Environment Redeploy

Redeploy an existing Env0 environment.

`env0:environment:redeploy`

#### Inputs

| Input     | Description                                           | Type   | Required |
|-----------|-------------------------------------------------------|--------|----------|
| id        | The environment id to redeploy.                       | string                    | Yes      |
| comment   | A comment to the new deployment.                      | string                    | No       |
| variables | A list of variables to add/modify to the environment. | array(env0VariableObject) | No       |

### Outputs

| Output         | Description                      |
|----------------|----------------------------------|
| environmentId  | The environment id.              |
| deploymentId   | The newly created deployment id. |
| deploymentUrl  | The URL of the deployment.       |

#### Example
    
```yaml
steps:
  - id: redeploy-env0-environment
    name: Redeploy Env0 Environment
    action: env0:environment:redeploy
    input:
      id: my-env-id
      comment: New deployment
      variables:
        - name: MY_VAR
          value: my-new-value

```
