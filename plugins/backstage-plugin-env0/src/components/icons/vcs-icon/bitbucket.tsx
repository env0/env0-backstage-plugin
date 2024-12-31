import { SvgIcon, SvgIconProps } from '@material-ui/core';
import React from 'react';

export const BitbucketIcon = (props: SvgIconProps) => (
  <SvgIcon
    {...props}
    style={{ fill: '#2684FF', fillRule: 'evenodd', clipRule: 'evenodd' }}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="12.37 13.7 23.41 21.05"
  >
    <path d="M12.547 13.958a.75.75 0 0 1 .578-.26l21.889.003a.75.75 0 0 1 .75.87L32.58 34.116a.75.75 0 0 1-.75.63H16.556a1.02 1.02 0 0 1-.997-.851l-3.184-19.328a.75.75 0 0 1 .172-.61Zm9.11 13.708h4.874l1.181-6.896h-7.376l1.32 6.896Z" />
    <path
      fill="url(#bitbucket_svg__a)"
      d="M34.751 20.77h-7.038l-1.182 6.896h-4.875L15.9 34.5c.182.157.415.245.656.247h15.278a.75.75 0 0 0 .75-.63z"
    />
    <defs>
      <linearGradient
        id="bitbucket_svg__a"
        x1="30.256"
        x2="22.125"
        y1="18.389"
        y2="29.934"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset=".18" stopColor="#0052CC" />
        <stop offset="1" stopColor="#2684FF" />
      </linearGradient>
    </defs>
  </SvgIcon>
);
