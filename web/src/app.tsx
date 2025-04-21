import React from 'react';

import { createBrowserRouter, RouterProvider } from 'react-router';
import { routesConfig } from '@/routes';

const router = createBrowserRouter(routesConfig);

export const App: React.FC = () => {
  return <RouterProvider router={router} />;
};
