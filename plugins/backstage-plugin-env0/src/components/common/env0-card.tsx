import React from 'react';
import Button from '@material-ui/core/Button';
import Cached from '@material-ui/icons/Cached';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { Env0Icon } from '../icons';

type CardProps = {
  title: string;
  subheader?: string;
  retryAction?: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
};

export const Env0Card = ({
  title,
  subheader,
  retryAction,
  actions,
  children,
}: CardProps) => (
  <Card>
    <CardHeader
      title={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4em',
          }}
        >
          <Env0Icon />
          <span>{title}</span>
        </div>
      }
      subheader={subheader}
      titleTypographyProps={{ variant: 'h5' }}
      action={
        <>
          {actions}
          {retryAction ? (
            <Button onClick={retryAction}>
              <Cached />
            </Button>
          ) : undefined}
        </>
      }
    />

    <div style={{ marginTop: '1em' }}>{children}</div>
  </Card>
);
