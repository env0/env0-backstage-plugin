import React from 'react';
import { Content, Page } from '@backstage/core-components';
import { Env0DeploymentTable } from './env0-deployment-table';
import { useEntity } from '@backstage/plugin-catalog-react';
import { ENV0_ENVIRONMENT_ANNOTATION } from './common/is-plugin-available';

export const Env0TabComponent = () => {
  const { entity } = useEntity();
  const environmentId =
    entity.metadata.annotations?.[ENV0_ENVIRONMENT_ANNOTATION];

  if (!environmentId) {
    return (
      <Page themeId="tool">
        <Content>
          <div>Environment ID not found</div>
        </Content>
      </Page>
    );
  }

  return (
    <Page themeId="tool">
      <Content>
        <Env0DeploymentTable environmentId={environmentId} />
      </Content>
    </Page>
  );
};
