import React from 'react';
import { useGetDeployments } from '../../hooks/use-deployments-history';
import { Table, TableColumn } from '@backstage/core-components';
import { Deployment } from '../../api/types';
import { PlanSummary } from './plan-summary';
import { DeploymentType } from './deployment-type';
import { formatDatetime, parseTimerElapsedTime } from '../common/time.utils';
import dayjs from '../common/dayjs.types';
import { DeploymentTableHeader } from './deployment-table-header';
import { ErrorContainer } from '../common/error-container';
import Status from '../env0-status/status';

const columnHeaderStyle = {
  color: '#3636D8',
  borderBottom: '1px solid #f0f0f0',
  fontWeight: '500',
};

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
    <Table<Deployment>
      title={<DeploymentTableHeader />}
      options={{
        headerStyle: columnHeaderStyle,
        paging: false,
        search: false,
      }}
      data={deployments ?? []}
      columns={deploymentHistoryColumns}
      isLoading={isLoading}
    />
  );
};
