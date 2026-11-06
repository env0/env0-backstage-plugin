import { useMemo, FC } from 'react';
import isNumber from 'lodash/isNumber';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';

const ResourceCountText = styled('span')({
  cursor: 'default',
});

export const ResourceCount: FC<{ resourceCount?: number }> = ({
  resourceCount,
}) => {
  const [text, tooltipText] = useMemo(() => {
    if (isNumber(resourceCount)) {
      return [
        resourceCount,
        resourceCount === 0
          ? 'env0 did not detect any active resources in this environment'
          : `env0 detected ${resourceCount} active resources in this environment`,
      ];
    }

    return [
      'N/A',
      'env0 could not detect how many resources exist in this environment',
    ];
  }, [resourceCount]);
  return (
    <Tooltip title={tooltipText}>
      <ResourceCountText>{text}</ResourceCountText>
    </Tooltip>
  );
};
