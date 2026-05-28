import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { router } from '@/app/router';

import './styles.css';
import { GraphQLProvider } from './apollo/provider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GraphQLProvider>
      <RouterProvider router={router} />
    </GraphQLProvider>
  </React.StrictMode>,
);
