import gitUrlParse from 'git-url-parse';
import {GitProviders, Template} from "../../api/types";

const getRepositoryUrl = (repository: string) => {
    let repoUrl = gitUrlParse(repository);

    if (repository.startsWith('http') && !!repoUrl.user) {
        repository = repository.replace(new RegExp(`${repoUrl.user}(:.*)?@`), '');
    }

    repoUrl = gitUrlParse(repository);
    repoUrl.resource = repoUrl.resource.replace(/:\d+$/, '');

    const url = repoUrl.toString('https');
    const suffix = '.git';

    return url.endsWith(suffix) ? url.substring(0, url.length - suffix.length) : url;
};

export const getGitProvider = ({
                                          repository,
                                          githubInstallationId,
                                          isGitLab,
                                          isAzureDevOps,
                                          isHelmRepository,
                                          bitbucketClientKey,
                                          isBitbucketServer,
                                          isGitLabEnterprise,
                                          isGitHubEnterprise
                                      }: Pick<
    Template,
    | 'repository'
    | 'githubInstallationId'
    | 'isGitLab'
    | 'isAzureDevOps'
    | 'isHelmRepository'
    | 'bitbucketClientKey'
    | 'isBitbucketServer'
    | 'isGitLabEnterprise'
    | 'isGitHubEnterprise'
>): GitProviders | undefined => {
    if (!repository) return undefined;
    if (githubInstallationId) return 'GitHub';
    if (isGitLab) return 'GitLab';
    if (isAzureDevOps) return 'AzureDevOps';
    if (isHelmRepository) return 'HelmRepository';
    if (bitbucketClientKey) return 'BitBucket';
    if (isBitbucketServer) return 'BitBucketServer';
    if (isGitLabEnterprise) return 'GitLabEnterprise';
    if (isGitHubEnterprise) return 'GitHubEnterprise';
    return 'Other';
};

export const getShortenRepo = (repoUrl: string, template: Template) => {
    const fixedRepoUrl = getRepositoryUrl(repoUrl);
    const providerName = getGitProvider(template)
    if (providerName === 'HelmRepository') {
        return fixedRepoUrl.split('/').slice(-2)[0];
    } else {
        let repoName: string;
        let projectName: string;

        if (providerName === 'AzureDevOps') {
            [repoName, , projectName] = fixedRepoUrl.split('/').reverse();
        } else {
            [repoName, projectName] = fixedRepoUrl.split('/').reverse();
        }
        return `${projectName}/${repoName}`;
    }
};
