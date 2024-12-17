import React, { useMemo } from 'react';
import isNumber from 'lodash/isNumber';
import { Tooltip } from '@material-ui/core';

export const ResourceCount: React.FC<{ resourceCount?: number }> = ({
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
      <span>{text}</span>
    </Tooltip>
  );
};
