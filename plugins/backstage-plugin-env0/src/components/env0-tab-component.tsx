import React from 'react';
import { Content, Page } from '@backstage/core-components';
import { Env0DeploymentTable } from './env0-deployment-table/env0-deployment-table';
import { useEntity } from '@backstage/plugin-catalog-react';
import { ENV0_ENVIRONMENT_ANNOTATION } from './common/is-plugin-available';
import { ErrorContainer } from './common/error-container';
import { Env0TemplateSelector } from './env0-template-selector/env0-template-selector';

export const Env0TabComponent = () => {
  const { entity } = useEntity();
  const environmentId =
    entity.metadata.annotations?.[ENV0_ENVIRONMENT_ANNOTATION];

  if (!environmentId) {
    return (
      <Page themeId="tool">
        <Content>
          <ErrorContainer error={new Error('No environment ID found')} />
        </Content>
      </Page>
    );
  }

  return (
    <Page themeId="tool">
      <Content>
        <Env0DeploymentTable environmentId={environmentId} />
        <div style={{ border: '1px solid red' }}>
          <p>
            This is a ui:* custom field implemented originally for the
            template.yaml. Now render it as isolated component on the entity
            page:
          </p>
          <Env0TemplateSelector
            onChange={templateId =>
              console.log(`Selected Template: ${templateId}`)
            }
            schema={{
              title: 'Select a Template',
            }}
            rawErrors={[]}
            required={true}
            formData={undefined}
          />
        </div>
      </Content>
    </Page>
  );
};
