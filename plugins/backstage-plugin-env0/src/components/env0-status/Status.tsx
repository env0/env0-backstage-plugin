import React from 'react';
import { makeStyles, Chip, ChipProps } from '@material-ui/core';

interface StatusProps extends ChipProps {
  status: string;
}

/**
  background-color: ${({ status }) => statusToTextAndColor[status].bgColor};
  color: ${({ status }) => statusToTextAndColor[status].color};
 */

const useStyles = makeStyles({
  statusContainer: (props: StatusProps) => ({
    borderRadius: '4px',
    fontWeight: 600,
    fontSize: '12px',
    lineHeight: '22px',
    padding: '0 10.5px',
    textAlign: 'center',
    maxWidth: '140px',
    backgroundColor: props.status === 'ACTIVE' ? '#00C853' : '#FF8A65',
    color: props.status === 'ACTIVE' ? '#00C853' : '#FF8A65',
    minWidth: '120px',
  }),
});

const Status: React.FC<StatusProps> = ({ status, ...props }) => {
  const className = useStyles({ status });

  return (
    <Chip className={className.statusContainer} label={status} {...props} />
  );
};

export default Status;
