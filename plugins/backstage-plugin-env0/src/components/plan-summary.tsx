import React from 'react';
import { styled } from '@material-ui/core';
import { EditOutlined, AddOutlined, RemoveOutlined } from '@material-ui/icons';

const addedColor = '#00bb00';
const changedColor = '#bbbb00';
const destroyedColor = '#bb0000';

type PlanSummaryProps = {
  summary: { added: number; changed: number; destroyed: number };
};

export const PlanSummary: React.FunctionComponent<PlanSummaryProps> = ({
  summary: { added, changed, destroyed },
}) => {
  return (
    <span data-e2e="deployment-step-summary">
      <SummaryItemContainer color={addedColor}>
        <AddOutlined /> {added}
      </SummaryItemContainer>
      <SummaryItemContainer color={changedColor}>
        <EditOutlined /> {changed}
      </SummaryItemContainer>
      <SummaryItemContainer color={destroyedColor}>
        <RemoveOutlined /> {destroyed}
      </SummaryItemContainer>
    </span>
  );
};

const SummaryItemContainer = styled('span')(({ color }: { color: string }) => ({
  display: 'inline-block',
  color: color,
  '&:not(:first-child)': {
    marginLeft: '10px',
  },
}));
