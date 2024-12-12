import React from 'react';
import dayjs from '../common/dayjs.types';
import { styled } from '@material-ui/core';
import { Table, TableColumn } from '@backstage/core-components';
import { Deployment } from '../../api/types';
import { useGetDeployments } from '../../hooks/use-deployments-history';
import { PlanSummary } from './plan-summary';
import { DeploymentType } from './deployment-type';
import { formatDatetime, parseTimerElapsedTime } from '../common/time.utils';
import { DeploymentTableHeader } from './deployment-table-header';
import { ErrorContainer } from '../common/error-container';
import { RedeployButton } from './redeploy-button';
import Status from '../env0-status/status';

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
    field: 'resourceCount',
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
  } = useGetDeployments(environmentId);

  if (error) {
    return <ErrorContainer error={error} />;
  }

  return (
    <Table
      title={<DeploymentTableHeader />}
      actions={[
        {
          icon: 'Redeploy',
          position: 'toolbar',
          onClick: () => console.log('Redeploy'),
        },
      ]}
      components={{
        Actions: () => (
          <ActionsWrapper>
            <RedeployButton />
          </ActionsWrapper>
        ),
      }}
      options={{
        paging: false,
        search: false,
      }}
      data={deployments ?? []}
      columns={deploymentHistoryColumns}
      isLoading={isLoading}
    />
  );
};

const ActionsWrapper = styled('div')({
  padding: '1px 1em 0 1em',
  alignSelf: 'start',
  placeSelf: 'start',
});
