import React from 'react';
import {Typography, Grid} from '@material-ui/core';
import {
    InfoCard,
    Header,
    Page,
    Content,
    ContentHeader,
    HeaderLabel,
    SupportButton,
} from '@backstage/core-components';
import {ExampleFetchComponent} from '../ExampleFetchComponent';
import {useApi} from "@backstage/core-plugin-api";
import {env0ApiRef} from "../../api";
import useAsync from "react-use/lib/useAsync";
import {Env0Api} from "../../api/types";

export const ExampleComponent = () => {
    const api = useApi<Env0Api>(env0ApiRef);

    const {
        value: environments,
    } = useAsync(async () => {

        const environments = await api.listEnvironments('1a433171-217e-4f58-9b4e-308d4d77902f');
        return {
            environments
        };
    });
    console.log(environments);
    return (
        <Page themeId="tool">
            <Header title="Welcome to env0!" subtitle="Optional subtitle">
                <HeaderLabel label="Owner" value="Team X"/>
                <HeaderLabel label="Lifecycle" value="Alpha"/>
            </Header>
            <Content>
                <ContentHeader title="Plugin title">
                    <SupportButton>A description of your plugin goes here.</SupportButton>
                </ContentHeader>
                <Grid container spacing={3} direction="column">
                    <Grid item>
                        <InfoCard title="Information card">
                            <Typography variant="body1">
                                All content should be wrapped in a card like this.
                            </Typography>
                        </InfoCard>
                    </Grid>
                    <Grid item>
                        <ExampleFetchComponent/>
                    </Grid>
                </Grid>
            </Content>
        </Page>
    );
};
