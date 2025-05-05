import { RouteObject } from 'react-router';
import { Home } from '@/pages/Home';
import { NotFound } from '@/pages/NotFound';
import { Redirect } from '@/pages/Redirect';

export const routesConfig: RouteObject[] = [
  { path: '/', Component: Home },
  { path: '/:shortened-link', Component: Redirect },
  { path: '*', Component: NotFound },
];
