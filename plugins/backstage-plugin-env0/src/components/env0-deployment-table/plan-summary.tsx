import { FunctionComponent } from 'react';
import { styled } from '@material-ui/core';
import EditOutlined from '@mui/icons-material/EditOutlined';
import AddOutlined from '@mui/icons-material/AddOutlined';
import RemoveOutlined from '@mui/icons-material/RemoveOutlined';

const addedColor = '#00bb00';
const changedColor = '#bbbb00';
const destroyedColor = '#bb0000';

type PlanSummaryProps = {
  summary: { added: number; changed: number; destroyed: number };
};

const SummaryItemContainer = styled('span')(({ color }: { color: string }) => ({
  display: 'inline-block',
  color: color,
  '&:not(:first-child)': {
    marginLeft: '10px',
  },
}));

export const PlanSummary: FunctionComponent<PlanSummaryProps> = ({
  summary: { added, changed, destroyed },
}) => {
  return (
    <span>
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
