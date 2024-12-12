import React from 'react';
import { styled } from '@material-ui/core';

const HeaderContainer = styled('div')({
  flex: '1',
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'start',
  gap: '10em',
  border: '1px solid red',
});

const TitleContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
});

const DescriptionContainer = styled('p')({
  fontSize: '14px',
  fontWeight: 'normal',
});

export const DeploymentTableHeader: React.FunctionComponent = () => {
  return (
    <HeaderContainer>
      <TitleContainer>
        <div>Env0 Deployments</div>
        <DescriptionContainer>
          View the history of deployments for this environment in env0
        </DescriptionContainer>
      </TitleContainer>
    </HeaderContainer>
  );
};
