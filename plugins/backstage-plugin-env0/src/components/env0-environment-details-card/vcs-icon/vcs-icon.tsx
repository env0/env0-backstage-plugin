import {GitProviders} from "../../../api/types";
import {GitIcon} from "./git";


interface Props {
    providerName: GitProviders;
}

export const VcsIcon = ({ providerName }: Props) => {
    // if (!providerName)
        return <GitIcon />;
    // return {
    //     BitBucket: <Bitbucket />,
    //     BitBucketServer: <Bitbucket />,
    //     GitHub: <Github />,
    //     GitHubEnterprise: <Github />,
    //     GitLab: <Gitlab />,
    //     GitLabEnterprise: <Gitlab />,
    //     AzureDevOps: <AzureDevOps />,
    //     HelmRepository: <Helm />,
    //     Other: <GitIcon />
    // }[providerName];
};