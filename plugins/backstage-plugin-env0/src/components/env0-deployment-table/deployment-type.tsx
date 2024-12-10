import React, { CSSProperties } from 'react';
import { Deployment } from '../../api/types';
import { Avatar, styled, SvgIcon } from '@material-ui/core';
import { DeployIcon, DestroyIcon } from '../icons';
import CodeOutlined from '@material-ui/icons/CodeOutlined';
import FindInPage from '@material-ui/icons/FindInPage';

const Container = styled('span')({
  display: 'flex',
  alignItems: 'center',
  width: 'fit-content',
});

const DeploymentTypeTextContainer = styled('div')({
  marginLeft: '1em',
});

const defaultIconStyle = {
  color: '#3636D8',
  backgroundColor: 'rgb(54, 54, 216, 0.08)',
};

const iconPropsMap: Record<
  Deployment['type'],
  { icon: typeof SvgIcon; style?: CSSProperties }
> = {
  destroy: { icon: DestroyIcon },
  deploy: {
    icon: DestroyIcon,
    style: {
      color: '#D83636',
      backgroundColor: 'rgb(216, 54, 54, 0.08)',
    },
  },
  driftDetection: {
    icon: FindInPage,
  },
  remotePlan: {
    icon: DeployIcon, // <DifferenceOutlined />, TODO: find a fitting icon replacement for this one
  },
  prPlan: {
    icon: DeployIcon, // <DifferenceOutlined />,
  },
  task: {
    icon: CodeOutlined,
  },
};

const deploymentTypeTextMap: Record<Deployment['type'], string> = {
  destroy: 'Destroy',
  deploy: 'Deploy',
  driftDetection: 'Drift Detection',
  remotePlan: 'Remote Plan',
  prPlan: 'PR Plan',
  task: 'Task',
};

export const DeploymentType: React.FunctionComponent<{
  type: Deployment['type'];
}> = ({ type }) => {
  const { icon, style = defaultIconStyle } = iconPropsMap[type] ?? {};
  return (
    <Container>
      <Avatar style={style}>
        <SvgIcon component={icon} />
      </Avatar>
      <DeploymentTypeTextContainer>
        {deploymentTypeTextMap[type] ?? ''}
      </DeploymentTypeTextContainer>
    </Container>
  );
};
