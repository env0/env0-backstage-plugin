import React from 'react';
import { Content, Page } from '@backstage/core-components';
import { Env0DeploymentTable } from './env0-deployment-table';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export const Env0TabComponent = () => (
  <Page themeId="tool">
    <Content>
      <QueryClientProvider client={queryClient}>
        <Env0DeploymentTable
          environmentId={'94da6324-61b1-46ac-95fb-4c00e4e18c85'}
        />
      </QueryClientProvider>
    </Content>
  </Page>
);
