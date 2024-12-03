import React from 'react';

import {useApi} from "@backstage/core-plugin-api";
import {Env0Api} from "../../api/types";
import useAsync from "react-use/lib/useAsync";
import {ErrorContainer} from "../common/error-container";
import {
    InfoCard,
    Progress,
    StructuredMetadataTable,
} from '@backstage/core-components';
import {env0ApiRef} from "../../api";
import {CardHeader} from "@material-ui/core";

type CardProps = {
    children: React.ReactNode;
}
const Env0Card = ({children, ...rest}: CardProps) => (
    <InfoCard {...rest}>
        <CardHeader title="env0"
                    titleTypographyProps={
                        {variant: 'h5'}
                    }
        />
        {children}
    </InfoCard>
);

export const Env0EnvironmentDetailsCard = () => {
    const api = useApi<Env0Api>(env0ApiRef);

    const {
        value: environment,
        loading,
        error

    } = useAsync(async () => {

        const environment = await api.getEnvironmentByID('ce265dd1-874f-44fb-99bd-4206460ba4ca');
        return {
            environment
        };
    });
    if (error) {
        return <Env0Card><ErrorContainer error={error}/></Env0Card>;
    }
    if (loading) {
        return (
            <Env0Card><Progress/></Env0Card>

        );
    }

    return (
        <Env0Card>
            <StructuredMetadataTable
                dense
                metadata={{
                    name: environment?.environment.name,
                    status: environment?.environment.status,
                    driftStatus: environment?.environment.driftStatus,
                    vcsRepo: environment?.environment.latestDeploymentLog.blueprintRepository,
                    revision: environment?.environment.latestDeploymentLog.blueprintRevision,
                    workspaceName: environment?.environment.workspaceName,
                    resources: environment?.environment.resources?.length,
                    createdBy: environment?.environment.user.name,
                }
                }/>
        </Env0Card>
    );
}