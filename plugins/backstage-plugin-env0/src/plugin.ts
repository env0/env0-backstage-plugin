import {
    createApiFactory,
    createPlugin,
    createRoutableExtension, discoveryApiRef, fetchApiRef,
} from '@backstage/core-plugin-api';

import {rootRouteRef} from './routes';
import {env0ApiRef, Env0Client} from "./api";

export const backstagePluginEnv0Plugin = createPlugin({
    id: 'env0',
    apis: [
        createApiFactory({
            api: env0ApiRef,
            deps: {discoveryApi: discoveryApiRef, fetchApi: fetchApiRef},
            factory: ({discoveryApi, fetchApi}) =>
                new Env0Client({discoveryApi, fetchApi}),
        }),
    ],
});

export const BackstagePluginEnv0Page = backstagePluginEnv0Plugin.provide(
    createRoutableExtension({
        name: 'BackstagePluginEnv0Page',
        component: () =>
            import('./components/ExampleComponent').then(m => m.ExampleComponent),
        mountPoint: rootRouteRef,
    }),
);
