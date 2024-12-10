import React from 'react';
import { styled } from '@material-ui/core';

const HeaderContainer = styled('div')({
  fontSize: '1em',
  fontWeight: 'normal',
});

const DescriptionContainer = styled('p')({
  fontSize: '14px',
  fontWeight: 'normal',
});

export const DeploymentTableHeader: React.FunctionComponent = () => {
  return (
    <>
      <HeaderContainer>Env0 Deployments</HeaderContainer>
      <DescriptionContainer>
        View the history of deployments for this environment in env0
      </DescriptionContainer>
    </>
  );
};
