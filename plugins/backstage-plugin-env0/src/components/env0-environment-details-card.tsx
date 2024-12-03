import React from 'react';

import {useApi} from "@backstage/core-plugin-api";
import {Env0Api} from "../api/types";
import useAsync from "react-use/lib/useAsync";
import {ErrorContainer} from "./common/error-container";
import {
    Progress,
    StructuredMetadataTable,
} from '@backstage/core-components';
import {env0ApiRef} from "../api";

export const Env0EnvironmentDetailsCard = () => {
    const api = useApi<Env0Api>(env0ApiRef);

    const {
        value: environment,
        loading,
        error

    } = useAsync(async () => {

        const environment = await api.getEnvironmentByID('1a433171-217e-4f58-9b4e-308d4d77902f');
        return {
            environment
        };
    });
    if (error) {
        return <ErrorContainer error={error}/>;
    }
    if (loading) {
        return (
            <Progress/>

        );
    }

    return (
        <StructuredMetadataTable
            dense
            metadata={{
                name: environment?.environment.name,
                status: environment?.environment.status,
                driftStatus: environment?.environment.driftStatus,
                vcsRepo: environment?.environment.latestDeploymentLog.blueprintRepository,
                revision: environment?.environment.latestDeploymentLog.blueprintRevision,
                workspaceName: environment?.environment.workspaceName,
                resources: environment?.environment.resources.length,
                createdBy: environment?.environment.user.name,
            }
            }/>
    );
}