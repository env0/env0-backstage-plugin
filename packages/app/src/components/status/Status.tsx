import React from 'react';
import { makeStyles, Theme, Chip, Paper } from '@material-ui/core';

interface StatusProps {
  status: string;
}

const useStyles = makeStyles({
  statusContainer: props => ({
    borderRadius: '4px',
    fontWeight: 600,
    fontSize: '12px',
    lineHeight: '22px',
    padding: '0 10.5px',
    textAlign: 'center',
    maxWidth: '140px',
  }),
});

const Status: React.FC<StatusProps> = ({ status }) => {
  return <Chip label={status} />;
};

export default Status;

/**
  background-color: ${({ status }) => statusToTextAndColor[status].bgColor};
  color: ${({ status }) => statusToTextAndColor[status].color};
  min-width: ${({ minWidth }) => minWidth || '120px'};
 */
