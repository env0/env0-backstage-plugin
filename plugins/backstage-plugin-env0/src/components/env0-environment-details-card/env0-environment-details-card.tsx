import React from 'react';

import { useApi } from '@backstage/core-plugin-api';
import { Env0Api } from '../../api/types';
import useAsync from 'react-use/lib/useAsync';
import { ErrorContainer } from '../common/error-container';
import {
  InfoCard,
  Progress,
  StructuredMetadataTable,
  Link,
} from '@backstage/core-components';
import isEmpty from 'lodash/isEmpty';
import { getGitProvider, getShortenRepo } from './get-shorten-repo';
import { VcsIcon } from './vcs-icon';
import { env0ApiRef } from '../../api';
import { CardHeader } from '@material-ui/core';
import { useEntity } from '@backstage/plugin-catalog-react';
import { ENV0_ENVIRONMENT_ANNOTATION } from '../common/is-plugin-available';
import { Env0Icon } from '../env0-icon';

type CardProps = {
  children: React.ReactNode;
};

const Env0Card = ({ children, ...rest }: CardProps) => (
  <InfoCard {...rest}>
    <CardHeader
      title="env0"
      avatar={<Env0Icon style={{ fontSize: 40 }} />}
      titleTypographyProps={{ variant: 'h5' }}
    />
    {children}
  </InfoCard>
);

export const Env0EnvironmentDetailsCard = () => {
  const api = useApi<Env0Api>(env0ApiRef);
  const { entity } = useEntity();
  const environmentId =
    entity.metadata.annotations?.[ENV0_ENVIRONMENT_ANNOTATION];

  const { value, loading, error } = useAsync(async () => {
    if (isEmpty(environmentId)) {
      throw new Error("Entity's Environment ID is empty");
    }
    const environment = await api.getEnvironmentByID(environmentId!);
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
      <Env0Card>
        <ErrorContainer error={error} />
      </Env0Card>
    );
  }
  if (loading || !environment || !template) {
    return (
      <Env0Card>
        <Progress />
      </Env0Card>
    );
  }

  const vcsRepo = (
    <>
      <VcsIcon providerName={getGitProvider(template)} />
      <Link to={environment.latestDeploymentLog.blueprintRepository}>
        {getShortenRepo(
          environment.latestDeploymentLog.blueprintRepository,
          template,
        )}
      </Link>
    </>
  );

  return (
    <Env0Card>
      <StructuredMetadataTable
        dense
        metadata={{
          name: environment.name,
          status: environment.status,
          driftStatus: environment.driftStatus,
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
