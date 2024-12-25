import React from 'react';
import dayjs from '../common/dayjs.types';
import { Table, TableColumn } from '@backstage/core-components';
import { Deployment } from '../../api/types';
import { useGetDeployments } from '../../hooks/use-deployments-history';
import { PlanSummary } from './plan-summary';
import { DeploymentType } from './deployment-type';
import { formatDatetime, parseTimerElapsedTime } from '../common/time.utils';
import { ErrorContainer } from '../common/error-container';
import Status from '../env0-status/status';
import { Env0Card } from '../common/env0-card';
import { RedeployButton } from './redeploy-button';
import { ResourceCount } from './resource-count';
import { useGetEnvironmentById } from '../../hooks/use-get-environment';
import { DeploymentErrorContainer } from './deployment-error-container';

const getFormattedDeploymentDuration = (deployment: Deployment) => {
  if (!deployment.finishedAt || !deployment.startedAt) return '-';
  const durationInSeconds = dayjs
    .duration(dayjs(deployment.finishedAt).diff(deployment.startedAt))
    .asSeconds();
  return parseTimerElapsedTime(durationInSeconds);
};

const deploymentHistoryColumns: TableColumn<Deployment>[] = [
  {
    title: 'Type',
    render: (deployment: Deployment) => (
      <DeploymentType type={deployment.type} />
    ),
  },
  {
    title: 'Status',
    render: (deployment: Deployment) => <Status status={deployment.status} />,
  },
  {
    title: 'Plan Summary',
    render: (deployment: Deployment) =>
      deployment.planSummary ? (
        <PlanSummary summary={deployment.planSummary} />
      ) : (
        <div>N/A</div>
      ),
  },
  {
    title: 'Resource Count',
    render: (deployment: Deployment) => (
      <ResourceCount resourceCount={deployment.resourceCount} />
    ),
  },
  {
    title: 'Started At',
    render: (deployment: Deployment) => (
      <div>{formatDatetime(deployment.startedAt)}</div>
    ),
  },
  {
    title: 'Duration',
    render: (deployment: Deployment) => (
      <div>{getFormattedDeploymentDuration(deployment)}</div>
    ),
  },
];

export const Env0DeploymentTable: React.FunctionComponent<{
  environmentId: string;
}> = ({ environmentId }) => {
  const {
    value: deployments,
    loading: isLoading,
    error,
    retry,
  } = useGetDeployments(environmentId);
  const { value: environment, loading: isEnvironmentLoading } =
    useGetEnvironmentById(environmentId);

  if (error) {
    return <ErrorContainer error={error} />;
  }

  return (
    <Env0Card
      title="env0 Deployments"
      subheader="View the history of deployments for this environment in env0."
      retryAction={retry}
      actions={
        <RedeployButton
          afterDeploy={retry}
          disabled={deployments?.length === 0}
        />
      }
    >
      {!isEnvironmentLoading && environment?.latestDeploymentLog.error && (
        <DeploymentErrorContainer
          errorMessage={environment.latestDeploymentLog.error.message}
        />
      )}
      <Table
        options={{
          paging: false,
          search: false,
          toolbar: false,
        }}
        data={deployments ?? []}
        columns={deploymentHistoryColumns}
        isLoading={isLoading}
      />
    </Env0Card>
  );
};
