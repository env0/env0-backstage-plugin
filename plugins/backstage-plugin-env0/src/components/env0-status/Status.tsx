import React from 'react';
import { makeStyles, Chip, ChipProps } from '@material-ui/core';
import { statusToTextAndColor } from './status-map';

interface StatusProps extends ChipProps {
  status: keyof typeof statusToTextAndColor;
}

const useStyles = makeStyles({
  statusContainer: (props: StatusProps) => ({
    borderRadius: '4px',
    fontWeight: 600,
    fontSize: '12px',
    lineHeight: '22px',
    padding: '0 10.5px',
    textAlign: 'center',
    maxWidth: '140px',
    backgroundColor: statusToTextAndColor[props.status].bgColor,
    color: statusToTextAndColor[props.status].color,
    minWidth: '120px',
  }),
});

const Status: React.FC<StatusProps> = ({ status, ...props }) => {
  const className = useStyles({ status });

  return (
    <Chip className={className.statusContainer} label={statusToTextAndColor[status].text} {...props} />
  );
};

export default Status;
