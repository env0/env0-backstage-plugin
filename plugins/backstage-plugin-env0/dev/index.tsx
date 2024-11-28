import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { backstagePluginEnv0Plugin, BackstagePluginEnv0Page } from '../src/plugin';

createDevApp()
  .registerPlugin(backstagePluginEnv0Plugin)
  .addPage({
    element: <BackstagePluginEnv0Page />,
    title: 'Root Page',
    path: '/backstage-plugin-env0',
  })
  .render();
