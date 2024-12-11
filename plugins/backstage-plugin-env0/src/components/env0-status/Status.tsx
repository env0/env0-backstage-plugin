import React from 'react';
import { Chip, ChipProps, styled } from '@material-ui/core';
import { statusToTextAndColor } from './status-map';

interface StatusProps extends ChipProps {
  status: keyof typeof statusToTextAndColor;
}

const StyledChip = styled(Chip)(
  ({ status }: { status: keyof typeof statusToTextAndColor }) => ({
    borderRadius: '4px',
    fontWeight: 600,
    fontSize: '12px',
    lineHeight: '22px',
    padding: '0 10.5px',
    textAlign: 'center',
    maxWidth: '140px',
    backgroundColor: statusToTextAndColor[status].bgColor,
    color: statusToTextAndColor[status].color,
    minWidth: '120px',
  }),
);

const Status: React.FC<StatusProps> = ({ status, ...props }) => {
  return (
    <StyledChip
      status={status}
      label={statusToTextAndColor[status].text}
      {...props}
    />
  );
};

export default Status;
