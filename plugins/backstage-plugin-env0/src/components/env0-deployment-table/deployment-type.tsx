import { CSSProperties, ElementType, FunctionComponent } from 'react';
import { Deployment } from '../../api/types';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import SvgIcon from '@mui/material/SvgIcon';
import { DeployIcon, DestroyIcon, DiffIcon } from '../icons';
import CodeOutlined from '@mui/icons-material/CodeOutlined';
import FindInPage from '@mui/icons-material/FindInPage';

const Container = styled('span')({
  display: 'flex',
  alignItems: 'center',
  width: 'fit-content',
  whiteSpace: 'nowrap',
});

const DeploymentTypeTextContainer = styled('div')({
  marginLeft: '1em',
});

const defaultIconStyle = {
  backgroundColor: 'rgb(233, 233, 244, 0.33)',
};

const iconPropsMap: Record<
  Deployment['type'],
  { icon: ElementType; style?: CSSProperties }
> = {
  destroy: {
    icon: DestroyIcon,
    style: {
      backgroundColor: 'rgb(245, 234, 234, 0.33)',
    },
  },
  deploy: {
    icon: DeployIcon,
  },
  driftDetection: {
    icon: FindInPage,
  },
  remotePlan: {
    icon: DiffIcon,
  },
  prPlan: {
    icon: DiffIcon,
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

export const DeploymentType: FunctionComponent<{
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
