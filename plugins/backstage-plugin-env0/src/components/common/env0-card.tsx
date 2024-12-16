import React from 'react';
import Button from '@material-ui/core/Button';
import Cached from '@material-ui/icons/Cached';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { Env0Icon } from '../icons';
import { styled } from '@material-ui/core';

type CardProps = {
  title: string;
  subheader?: string;
  retryAction?: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
};

const Env0Title = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '0.4em',
});

export const Env0Card = ({
  title,
  subheader,
  retryAction,
  actions,
  children,
}: CardProps) => {
  const retryButton = !!retryAction && (
    <Button onClick={retryAction}>
      <Cached />
    </Button>
  );

  return (
    <Card>
      <CardHeader
        title={
          <Env0Title>
            <Env0Icon />
            <span>{title}</span>
          </Env0Title>
        }
        subheader={subheader}
        titleTypographyProps={{ variant: 'h5' }}
        action={
          <>
            {actions}
            {retryButton}
          </>
        }
      />

      <div style={{ marginTop: '1em' }}>{children}</div>
    </Card>
  );
};
