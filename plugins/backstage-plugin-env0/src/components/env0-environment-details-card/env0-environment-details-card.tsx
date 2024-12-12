import React from 'react';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsyncRetry';
import { ErrorContainer } from '../common/error-container';
import {
  Link,
  Progress,
  StructuredMetadataTable,
} from '@backstage/core-components';
import isEmpty from 'lodash/isEmpty';
import { getGitProvider, getShortenRepo } from './get-shorten-repo';
import { styled } from '@material-ui/core';
import { Env0Api, env0ApiRef } from '../../api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { ENV0_ENVIRONMENT_ANNOTATION } from '../common/is-plugin-available';
import { VcsIcon } from './vcs-icon';
import { Env0Card } from '../common/env0-card';
import Status from '../env0-status/status';
import { Env0Card } from '../common/env0-card';

const VcsLinkContainer = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
}));

const StyledLink = styled(Link)(() => ({
  paddingLeft: '5px',
}));

export const Env0EnvironmentDetailsCard = () => {
  const api = useApi<Env0Api>(env0ApiRef);
  const { entity } = useEntity();
  const environmentId =
    entity.metadata.annotations?.[ENV0_ENVIRONMENT_ANNOTATION];

  const { value, loading, error, retry } = useAsync(async () => {
    if (isEmpty(environmentId)) {
      throw new Error("Entity's Environment ID is empty");
    }
    const environment = await api.getEnvironmentById(environmentId!);
    const template = await api.getTemplateById(
      environment.latestDeploymentLog.blueprintId,
    );
    return {
      environment,
      template,
    };
  });
  const { environment, template } = value ?? {};
  if (error) {
    return (
      <Env0Card title="env0" retryAction={retry}>
        <ErrorContainer error={error} />
      </Env0Card>
    );
  }
  if (loading || !environment || !template) {
    return (
      <Env0Card title="env0" retryAction={retry}>
        <Progress />
      </Env0Card>
    );
  }

  const vcsRepo = (
    <VcsLinkContainer>
      <VcsIcon providerName={getGitProvider(template)} />
      <StyledLink to={environment.latestDeploymentLog.blueprintRepository}>
        {getShortenRepo(
          environment.latestDeploymentLog.blueprintRepository,
          template,
        )}
      </StyledLink>
    </VcsLinkContainer>
  );

  return (
    <Env0Card title="env0" retryAction={() => retry()}>
      <StructuredMetadataTable
        dense
        metadata={{
          name: environment.name,
          status: <Status status={environment.status} />,
          driftStatus: <Status status={environment.driftStatus} />,
          vcsRepo,
          revision: environment.latestDeploymentLog.blueprintRevision,
          workspaceName: environment.workspaceName,
          resources: environment.resources?.length,
          createdBy: environment.user.name,
        }}
      />
    </Env0Card>
  );
};
