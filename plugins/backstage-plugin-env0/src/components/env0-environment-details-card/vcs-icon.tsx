import React from 'react';

import { GitProviders } from '../../api/types';
import {
  GitIcon,
  BitbucketIcon,
  GithubIcon,
  GitlabIcon,
  AzureDevopsIcon,
  HelmIcon,
} from '../icons';

interface Props {
  providerName?: GitProviders;
}

export const VcsIcon = ({ providerName }: Props) => {
  if (!providerName) return <GitIcon />;
  return {
    BitBucket: <BitbucketIcon />,
    BitBucketServer: <BitbucketIcon />,
    GitHub: <GithubIcon />,
    GitHubEnterprise: <GithubIcon />,
    GitLab: <GitlabIcon />,
    GitLabEnterprise: <GitlabIcon />,
    AzureDevOps: <AzureDevopsIcon />,
    HelmRepository: <HelmIcon />,
    Other: <GitIcon />,
  }[providerName];
};
