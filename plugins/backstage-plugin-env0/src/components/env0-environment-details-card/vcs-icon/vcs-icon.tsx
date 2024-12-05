import React from 'react';

import { GitProviders } from '../../../api/types';
import { GitIcon } from './git';
import { BitbucketIcon } from './bitbucket';
import { GithubIcon } from './github';
import { GitlabIcon } from './gitlab';
import { AzureDevopsIcon } from './azure-devops';
import { HelmIcon } from './helm';

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
