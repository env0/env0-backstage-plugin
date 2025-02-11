import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { env0Plugin, Env0TabComponent } from '../src';

createDevApp()
  .registerPlugin(env0Plugin)
  .addPage({
    element: <Env0TabComponent />,
    title: 'Root Page',
    path: '/env0',
  })
  .render();
